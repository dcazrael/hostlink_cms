# Container-first local scripts design

- Goal: make everyday local development commands run through Docker Compose while keeping production build/start behavior unchanged.
- Scope: local developer workflow scripts in `package.json`, plus any small helper script(s) needed to ensure the `payload` container is running before `docker compose exec` commands.
- Keep unchanged: `build`, `start`, VPS Dockerfiles, VPS compose flow, and GitHub deploy workflow behavior.

## Approved approach

- Use option 1: keep production-safe scripts intact, wrap local development commands.
- `build` and `start` remain as they are now.
- `dev` becomes a host-side wrapper for `docker compose up -d`.
- Add local convenience commands:
  - `logs` → `docker compose logs -f payload`
  - `rebuild:container` → `docker compose up --build --force-recreate -d payload`
  - `recreate` → `docker compose up --force-recreate -d payload`
  - `restart:container` → `docker compose restart payload`

## Script layering

- Introduce container-internal scripts for commands that must run inside the app container.
- These scripts keep the real application commands, for example:
  - `dev:container`
  - `generate:importmap:container`
  - `generate:types:container`
  - `payload:container`
  - `db:migrate:container`
  - `db:migrate:create:container`
  - `test:container`
  - `test:int:container`
  - `test:e2e:container`
- Public scripts like `generate:types`, `payload`, `db:migrate`, and `test:int` become host-side wrappers that run those `*:container` commands via `docker compose exec payload ...`.

## Container lifecycle expectations

- `pnpm dev` starts both local services through Compose and returns immediately.
- `pnpm logs` is the primary way to tail server logs without tying logs to container lifetime.
- `pnpm rebuild:container` may be run while the current `payload` container exists; Compose will stop and recreate it automatically.
- `postgres` is not rebuilt by these commands.

## Safety rules

- Do not repurpose `build`; production Docker build currently depends on `pnpm run build`.
- Do not repurpose `start`; it remains available for production-style app startup.
- Do not change the VPS deployment path unless a later task explicitly targets deployment scripts.
- Host wrapper commands should either ensure the `payload` container is running first or fail with a clear message.

## Open questions for implementation plan

- Whether wrapper scripts should auto-start `payload` for every `exec`-based command or use one shared helper script to do that consistently.
- Whether `docker compose exec` commands should use `-T` for non-interactive commands such as tests and code generation.

## Acceptance criteria

- Local `pnpm dev`, `pnpm logs`, `pnpm rebuild:container`, `pnpm recreate`, and `pnpm restart:container` map to the approved Docker Compose behavior.
- Local codegen, migration, Payload CLI, and test commands run inside the `payload` container instead of on the host.
- `build` and `start` still behave exactly as before.
- Production files and deploy workflow remain unaffected.
