# VPS Deploy Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse the VPS DB/deploy workflow into one normal deploy path, one low-level restore-point helper, and one operator runbook.

**Architecture:** Merge normal migration behavior into `scripts/deploy-vps.sh`, remove hidden cutover behavior from steady-state deploys, and document the one-time local-DB-to-VPS replacement explicitly in the operator doc instead of scattering it across multiple docs. Keep restore-point creation as an internal helper used by deploy, not a separate operator workflow.

**Tech Stack:** Bash, Docker Compose, PostgreSQL tools (`pg_dump`, `pg_restore`, `pg_isready`), GitHub Actions YAML, Markdown docs, Vitest for regression tests.

---

## File map

- **Keep / modify**
  - `scripts/deploy-vps.sh` — only normal operator entrypoint.
  - `scripts/create-db-restore-point.sh` — low-level helper for local/VPS restore points.
  - `docs/deployment-vps.md` — only operator runbook.
  - `docs/migration-checklist.md` — developer-only migration checklist.
  - `.github/workflows/deploy.yml` — CI deploy guard stays aligned with the simplified operator flow.
- **Delete / absorb**
  - `scripts/vps-db-migrate.sh` — absorbed into `scripts/deploy-vps.sh`.
  - `scripts/vps-db-cutover.sh` — removed from steady-state deploy flow.
  - `docs/db-restore-points.md` — merged into `docs/deployment-vps.md`.
  - `docs/local-db-to-vps-cutover.md` — merged into `docs/deployment-vps.md`.
  - extra one-off docs that are no longer part of an active workflow.
- **Tests**
  - `tests/int/create-db-restore-point.int.spec.ts`
  - `tests/int/vps-db-cutover.int.spec.ts` (delete or replace depending on removed behavior)

### Task 1: Simplify the operator script surface

**Files:**
- Modify: `scripts/deploy-vps.sh`
- Delete: `scripts/vps-db-migrate.sh`
- Delete: `scripts/vps-db-cutover.sh`
- Test: `tests/int/create-db-restore-point.int.spec.ts`

- [ ] **Step 1: Write the failing test update for the final script surface**

```ts
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('deploy-vps script surface', () => {
  it('keeps deploy-vps as the only normal operator entrypoint', () => {
    const script = readFileSync(resolve(process.cwd(), 'scripts/deploy-vps.sh'), 'utf8')

    expect(script).not.toContain('./scripts/vps-db-migrate.sh')
    expect(script).toContain('pnpm payload migrate')
    expect(script).toContain('./scripts/create-db-restore-point.sh')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm vitest run --config ./vitest.config.mts tests/int/create-db-restore-point.int.spec.ts
```

Expected: FAIL because `deploy-vps.sh` still shells out to `vps-db-migrate.sh` and does not inline the migration path.

- [ ] **Step 3: Move normal migration flow into `scripts/deploy-vps.sh`**

Implement these exact changes:

```bash
# inside scripts/deploy-vps.sh, after APP_ENV_FILE / COMPOSE_PROJECT_NAME exports

docker compose \
  --project-name "$project_name" \
  --env-file "$env_file" \
  -f "$compose_file" \
  up -d postgres

echo "[deploy] Waiting for postgres to be ready..."
for attempt in $(seq 1 10); do
  if docker compose \
    --project-name "$project_name" \
    --env-file "$env_file" \
    -f "$compose_file" \
    exec -T postgres pg_isready -U "$POSTGRES_USER" -q 2>/dev/null; then
    echo "[deploy] postgres is ready."
    break
  fi
  if [[ $attempt -eq 10 ]]; then
    echo "Error: postgres not ready after 10 attempts." >&2
    exit 1
  fi
  sleep 3
done

if [[ "$skip_db_migrate" != "true" ]]; then
  if [[ "$skip_db_backup" != "true" ]]; then
    ./scripts/create-db-restore-point.sh \
      --env-file "$env_file" \
      --compose-file "$compose_file" \
      --compose-project "$project_name" \
      --postgres-service postgres \
      --timeout 120
  fi

  docker compose \
    --project-name "$project_name" \
    --env-file "$env_file" \
    -f "$compose_file" \
    build migrator

  docker compose \
    --project-name "$project_name" \
    --env-file "$env_file" \
    -f "$compose_file" \
    run --rm migrator pnpm payload migrate
fi
```

Then delete `scripts/vps-db-migrate.sh` and `scripts/vps-db-cutover.sh`.

- [ ] **Step 4: Run tests and syntax checks**

Run:

```bash
pnpm vitest run --config ./vitest.config.mts tests/int/create-db-restore-point.int.spec.ts
bash -n scripts/deploy-vps.sh scripts/create-db-restore-point.sh
```

Expected: PASS, no shell syntax output.

- [ ] **Step 5: Commit**

```bash
git add scripts/deploy-vps.sh scripts/create-db-restore-point.sh tests/int/create-db-restore-point.int.spec.ts
git rm scripts/vps-db-migrate.sh scripts/vps-db-cutover.sh
git commit -m "refactor: simplify VPS deploy flow"
```

### Task 2: Collapse operator docs into one runbook

**Files:**
- Modify: `docs/deployment-vps.md`
- Delete: `docs/db-restore-points.md`
- Delete: `docs/local-db-to-vps-cutover.md`
- Modify: `docs/migration-checklist.md`

- [ ] **Step 1: Write the failing doc-structure test**

Create or replace the test with:

```ts
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('VPS operator docs', () => {
  it('keeps one operator runbook and removes overlapping workflow docs', () => {
    expect(existsSync(resolve(process.cwd(), 'docs/deployment-vps.md'))).toBe(true)
    expect(existsSync(resolve(process.cwd(), 'docs/db-restore-points.md'))).toBe(false)
    expect(existsSync(resolve(process.cwd(), 'docs/local-db-to-vps-cutover.md'))).toBe(false)

    const runbook = readFileSync(resolve(process.cwd(), 'docs/deployment-vps.md'), 'utf8')
    expect(runbook).toContain('Local DB to VPS cutover')
    expect(runbook).toContain('pnpm db:restore-point')
    expect(runbook).toContain('./scripts/deploy-vps.sh --branch main --skip-db-migrate')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm vitest run --config ./vitest.config.mts tests/int/create-db-restore-point.int.spec.ts
```

Expected: FAIL because overlapping docs still exist and `deployment-vps.md` is not yet the single runbook.

- [ ] **Step 3: Merge docs into `docs/deployment-vps.md`**

Ensure `docs/deployment-vps.md` contains these sections in this order:

```md
## Normal Deploy

```bash
./scripts/deploy-vps.sh --branch main
```

This creates a restore point automatically before running committed migrations.

## Deploy Without DB Migration

```bash
./scripts/deploy-vps.sh --branch main --skip-db-migrate
```

## Local DB to VPS cutover

Use this when local is the verified source of truth.

1. Create a local dump:

```bash
pnpm db:restore-point
```

2. Copy the newest dump to the VPS.
3. Create a VPS restore point:

```bash
./scripts/create-db-restore-point.sh \
  --env-file .env.production \
  --compose-file docker-compose.vps.yml \
  --compose-project hostlink-site
```

4. Restore the local dump into VPS Postgres with `pg_restore --clean --if-exists`.
5. Deploy the app with:

```bash
./scripts/deploy-vps.sh --branch main --skip-db-migrate
```
```

Then delete `docs/db-restore-points.md` and `docs/local-db-to-vps-cutover.md`.

- [ ] **Step 4: Trim `docs/migration-checklist.md` to developer-only scope**

Replace the deploy section with:

```md
## 6) Push

Push the schema change and migration file together.

## 7) Verify production after deploy

- confirm CI deploy passed
- confirm admin and frontend load
- verify representative content still renders
```

Remove operator-specific SSH/VPS instructions from this file.

- [ ] **Step 5: Run the doc-structure test**

Run:

```bash
pnpm vitest run --config ./vitest.config.mts tests/int/create-db-restore-point.int.spec.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add docs/deployment-vps.md docs/migration-checklist.md tests/int/create-db-restore-point.int.spec.ts
git rm docs/db-restore-points.md docs/local-db-to-vps-cutover.md
git commit -m "docs: unify VPS deployment runbook"
```

### Task 3: Remove stale junk and align CI wording

**Files:**
- Modify: `.github/workflows/deploy.yml`
- Delete: obsolete one-off docs that are no longer part of an active workflow

- [ ] **Step 1: Write the failing cleanup test**

Append this test:

```ts
it('keeps CI wording aligned with the simplified deploy flow', () => {
  const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/deploy.yml'), 'utf8')
  expect(workflow).toContain('Check schema and migration coherence')
  expect(workflow).not.toContain('apply-schema.ts will run automatically')
})
```

- [ ] **Step 2: Run test to verify it fails only if stale wording remains**

Run:

```bash
pnpm vitest run --config ./vitest.config.mts tests/int/create-db-restore-point.int.spec.ts
```

Expected: PASS if wording is already clean; otherwise FAIL and then fix stale text.

- [ ] **Step 3: Delete remaining obsolete one-off docs**

Delete only docs that are not part of the final operator/developer workflow and are clearly superseded.

```bash
git rm docs/forms-spam-protection.md docs/homepage-ui-copy-localization.md
```

If either file is still actively referenced, stop and remove the reference first.

- [ ] **Step 4: Run final verification**

Run:

```bash
pnpm vitest run --config ./vitest.config.mts tests/int/create-db-restore-point.int.spec.ts
bash -n scripts/deploy-vps.sh scripts/create-db-restore-point.sh
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml')); print('Valid YAML')"
docker compose run --rm payload sh -c "cd /home/node/app && pnpm tsc --noEmit"
git diff --stat
```

Expected:
- Vitest PASS
- no shell syntax output
- `Valid YAML`
- TypeScript exit 0
- diff limited to the planned files

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/deploy.yml tests/int/create-db-restore-point.int.spec.ts
git commit -m "chore: remove obsolete VPS workflow docs"
```

## Self-review

- Spec coverage: tasks cover one operator entrypoint, one helper, one operator doc, one developer doc, and explicit local-to-VPS cutover.
- Placeholder scan: no TBD/TODO placeholders remain.
- Type consistency: script and doc names match the final structure in the design spec.
