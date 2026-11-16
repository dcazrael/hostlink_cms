# Container-first Local Scripts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make local development commands run through Docker Compose while keeping production `build` and `start` behavior unchanged.

**Architecture:** Split scripts into two layers. Keep production-safe application commands as `*:container` scripts in `package.json`, and make local public scripts call Docker Compose for container lifecycle or `docker compose exec payload ...` for in-container commands. Add one small helper script to ensure the `payload` service is running before exec-based commands.

**Tech Stack:** pnpm, Docker Compose, Next.js, Payload CMS, shell helper script

---

## File map

- Modify: `package.json`
  - Add container-internal scripts
  - Replace selected local scripts with Docker wrappers
- Create: `scripts/ensure-payload-container.sh`
  - Start `payload` and `postgres` if needed before `docker compose exec`
- Modify: `docker-compose.yml`
  - Change the `payload` service command to use `pnpm dev:container` instead of `pnpm dev`
- Modify: `docs/superpowers/specs/2026-06-16-container-first-local-scripts-design.md`
  - Only if implementation decisions need minor clarification after execution

### Task 1: Add the payload-container helper

**Files:**

- Create: `scripts/ensure-payload-container.sh`
- Test: `tests/int/container-scripts.int.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ensurePayloadContainerCommand } from "@/utilities/containerScripts";

describe("ensurePayloadContainerCommand", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("starts payload and postgres before exec commands", () => {
    expect(ensurePayloadContainerCommand("pnpm generate:types:container")).toBe(
      "sh ./scripts/ensure-payload-container.sh && docker compose exec payload pnpm generate:types:container",
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `docker compose up -d && docker compose exec payload sh -lc "pnpm exec vitest run tests/int/container-scripts.int.spec.ts"`
Expected: FAIL with module not found for `@/utilities/containerScripts`.

- [ ] **Step 3: Write minimal implementation**

Create the helper builder and shell script.

`src/utilities/containerScripts.ts`

```ts
export const ensurePayloadContainerCommand = (command: string): string =>
  `sh ./scripts/ensure-payload-container.sh && docker compose exec payload ${command}`;
```

`scripts/ensure-payload-container.sh`

```sh
#!/bin/sh
set -eu

payload_running="$(docker compose ps -q payload)"

if [ -z "$payload_running" ]; then
  docker compose up -d postgres payload
  exit 0
fi

payload_state="$(docker inspect -f '{{.State.Status}}' "$payload_running")"

if [ "$payload_state" != "running" ]; then
  docker compose up -d postgres payload
fi
```

- [ ] **Step 4: Run test to verify it passes**

Run: `docker compose up -d && docker compose exec payload sh -lc "pnpm exec vitest run tests/int/container-scripts.int.spec.ts"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/int/container-scripts.int.spec.ts src/utilities/containerScripts.ts scripts/ensure-payload-container.sh
git commit -m "feat: add local payload container helper"
```

### Task 2: Split package scripts into host wrappers and container commands

**Files:**

- Modify: `package.json`
- Modify: `docker-compose.yml:15-21`
- Test: `tests/int/container-scripts.int.spec.ts`

- [ ] **Step 1: Write the failing test**

Extend `tests/int/container-scripts.int.spec.ts` with exact assertions for the planned script mapping.

```ts
import pkg from "@/../package.json";

describe("package scripts", () => {
  it("keeps build and start unchanged", () => {
    expect(pkg.scripts.build).toBe(
      "cross-env NODE_OPTIONS=--no-deprecation next build",
    );
    expect(pkg.scripts.start).toBe(
      "cross-env NODE_OPTIONS=--no-deprecation next start",
    );
  });

  it("maps local dev commands through docker compose", () => {
    expect(pkg.scripts.dev).toBe("docker compose up -d");
    expect(pkg.scripts.logs).toBe("docker compose logs -f payload");
    expect(pkg.scripts.rebuild).toBe(
      "docker compose up --build --force-recreate -d payload",
    );
    expect(pkg.scripts.recreate).toBe(
      "docker compose up --force-recreate -d payload",
    );
    expect(pkg.scripts.restart).toBe("docker compose restart payload");
  });

  it("maps local exec commands to container wrappers", () => {
    expect(pkg.scripts["generate:types"]).toBe(
      "sh ./scripts/ensure-payload-container.sh && docker compose exec payload pnpm generate:types:container",
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `docker compose up -d && docker compose exec payload sh -lc "pnpm exec vitest run tests/int/container-scripts.int.spec.ts"`
Expected: FAIL because the current script values do not match.

- [ ] **Step 3: Write minimal implementation**

Update `package.json` scripts to this shape:

```json
{
  "scripts": {
    "build": "cross-env NODE_OPTIONS=--no-deprecation next build",
    "db:migrate": "sh ./scripts/ensure-payload-container.sh && docker compose exec payload pnpm db:migrate:container",
    "db:migrate:create": "sh ./scripts/ensure-payload-container.sh && docker compose exec payload pnpm db:migrate:create:container",
    "db:migrate:container": "pnpm payload migrate",
    "db:migrate:create:container": "pnpm payload migrate:create",
    "dev": "docker compose up -d",
    "dev:container": "cross-env NODE_OPTIONS=--no-deprecation next dev",
    "generate:importmap": "sh ./scripts/ensure-payload-container.sh && docker compose exec payload pnpm generate:importmap:container",
    "generate:importmap:container": "cross-env NODE_OPTIONS=--no-deprecation payload generate:importmap",
    "generate:types": "sh ./scripts/ensure-payload-container.sh && docker compose exec payload pnpm generate:types:container",
    "generate:types:container": "cross-env NODE_OPTIONS=--no-deprecation payload generate:types",
    "logs": "docker compose logs -f payload",
    "payload": "sh ./scripts/ensure-payload-container.sh && docker compose exec payload pnpm payload:container",
    "payload:container": "cross-env NODE_OPTIONS=--no-deprecation payload",
    "rebuild": "docker compose up --build --force-recreate -d payload",
    "recreate": "docker compose up --force-recreate -d payload",
    "restart": "docker compose restart payload",
    "start": "cross-env NODE_OPTIONS=--no-deprecation next start",
    "test": "sh ./scripts/ensure-payload-container.sh && docker compose exec payload pnpm test:container",
    "test:container": "pnpm run test:int:container && pnpm run test:e2e:container",
    "test:e2e": "sh ./scripts/ensure-payload-container.sh && docker compose exec payload pnpm test:e2e:container",
    "test:e2e:container": "cross-env NODE_OPTIONS=\"--no-deprecation --import=tsx/esm\" playwright test --config=playwright.config.ts",
    "test:int": "sh ./scripts/ensure-payload-container.sh && docker compose exec payload pnpm test:int:container",
    "test:int:container": "cross-env NODE_OPTIONS=--no-deprecation vitest run --config ./vitest.config.mts"
  }
}
```

Update `docker-compose.yml` so the service starts with:

```yaml
command: >
  sh -lc "
    rm -rf .next &&
    pnpm config set store-dir /pnpm/store &&
    pnpm install --frozen-lockfile --prefer-offline &&
    pnpm dev:container
  "
```

- [ ] **Step 4: Run test to verify it passes**

Run: `docker compose up -d && docker compose exec payload sh -lc "pnpm exec vitest run tests/int/container-scripts.int.spec.ts"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json docker-compose.yml tests/int/container-scripts.int.spec.ts
git commit -m "feat: route local scripts through docker compose"
```

### Task 3: Make non-interactive commands robust in containers

**Files:**

- Modify: `package.json`
- Test: `tests/int/container-scripts.int.spec.ts`

- [ ] **Step 1: Write the failing test**

Add assertions that non-interactive wrapper commands use `docker compose exec -T`.

```ts
it("uses non-interactive exec for codegen and tests", () => {
  expect(pkg.scripts["generate:types"]).toContain(
    "docker compose exec -T payload",
  );
  expect(pkg.scripts["generate:importmap"]).toContain(
    "docker compose exec -T payload",
  );
  expect(pkg.scripts["test:int"]).toContain("docker compose exec -T payload");
  expect(pkg.scripts["test:e2e"]).toContain("docker compose exec -T payload");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `docker compose up -d && docker compose exec payload sh -lc "pnpm exec vitest run tests/int/container-scripts.int.spec.ts"`
Expected: FAIL because wrappers still use `docker compose exec payload`.

- [ ] **Step 3: Write minimal implementation**

Adjust only non-interactive commands in `package.json` to use `docker compose exec -T payload ...`.

```json
{
  "scripts": {
    "db:migrate": "sh ./scripts/ensure-payload-container.sh && docker compose exec -T payload pnpm db:migrate:container",
    "db:migrate:create": "sh ./scripts/ensure-payload-container.sh && docker compose exec -T payload pnpm db:migrate:create:container",
    "generate:importmap": "sh ./scripts/ensure-payload-container.sh && docker compose exec -T payload pnpm generate:importmap:container",
    "generate:types": "sh ./scripts/ensure-payload-container.sh && docker compose exec -T payload pnpm generate:types:container",
    "test": "sh ./scripts/ensure-payload-container.sh && docker compose exec -T payload pnpm test:container",
    "test:e2e": "sh ./scripts/ensure-payload-container.sh && docker compose exec -T payload pnpm test:e2e:container",
    "test:int": "sh ./scripts/ensure-payload-container.sh && docker compose exec -T payload pnpm test:int:container"
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `docker compose up -d && docker compose exec payload sh -lc "pnpm exec vitest run tests/int/container-scripts.int.spec.ts"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json tests/int/container-scripts.int.spec.ts
git commit -m "fix: use non-interactive docker exec for local scripts"
```

### Task 4: Verify the end-to-end local workflow

**Files:**

- Modify: `package.json` only if verification reveals a concrete script bug
- Modify: `scripts/ensure-payload-container.sh` only if verification reveals a concrete startup bug
- Test: no new test file; use command verification

- [ ] **Step 1: Write the failing test**

Use command-level verification as the failing test for this workflow task.

Run: `pnpm dev && pnpm logs`
Expected: `pnpm dev` returns successfully, but `pnpm logs` reveals a concrete script or startup error if one remains.

- [ ] **Step 2: Run test to verify it fails**

Run these commands one at a time and record the exact failure if any:

```bash
pnpm dev
pnpm generate:types
pnpm generate:importmap
pnpm test:int
pnpm restart
pnpm recreate
pnpm rebuild
```

Expected: any remaining failures are specific and reproducible.

- [ ] **Step 3: Write minimal implementation**

Fix only the exact script or helper bug exposed by Step 2. Examples of acceptable small fixes:

```sh
# shell quoting fix
docker compose exec -T payload sh -lc 'pnpm generate:types:container'
```

```json
{
  "scripts": {
    "payload": "sh ./scripts/ensure-payload-container.sh && docker compose exec payload pnpm payload:container"
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
pnpm dev
pnpm generate:types
pnpm generate:importmap
pnpm test:int
pnpm logs
```

Expected:

- `pnpm dev` starts containers detached
- `pnpm generate:types` succeeds in the container
- `pnpm generate:importmap` succeeds in the container
- `pnpm test:int` runs in the container
- `pnpm logs` tails the payload service logs

- [ ] **Step 5: Commit**

```bash
git add package.json docker-compose.yml scripts/ensure-payload-container.sh tests/int/container-scripts.int.spec.ts
git commit -m "test: verify container-first local workflow"
```

## Self-review

- Spec coverage: all approved local commands are covered, `build` and `start` stay unchanged, and production deploy flow is explicitly preserved.
- Placeholder scan: no TODO/TBD markers; all tasks include exact files and commands.
- Type consistency: all wrapper scripts call matching `*:container` commands and the Compose service starts `dev:container`.
