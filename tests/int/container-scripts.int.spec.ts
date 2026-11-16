import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import pkg from '@/../package.json'

const dockerCompose = readFileSync(resolve(process.cwd(), 'docker-compose.yml'), 'utf8')

describe('package scripts', () => {
  it('keeps build and start unchanged', () => {
    expect(pkg.scripts.build).toBe('NODE_OPTIONS=--no-deprecation next build')
    expect(pkg.scripts.start).toBe('NODE_OPTIONS=--no-deprecation next start')
  })

  it('maps local dev commands through docker compose', () => {
    expect(pkg.scripts.dev).toBe('docker compose up -d')
    expect(pkg.scripts.logs).toBe('docker compose logs -f payload')
    expect(pkg.scripts['rebuild:container']).toBe(
      'docker compose up --build --force-recreate -d payload',
    )
    expect(pkg.scripts.recreate).toBe('docker compose up --force-recreate -d payload')
    expect(pkg.scripts['restart:container']).toBe('docker compose restart payload')
  })

  it('uses container-suffixed names for pnpm-conflicting docker commands', () => {
    expect((pkg.scripts as Record<string, string | undefined>).restart).toBeUndefined()
    expect((pkg.scripts as Record<string, string | undefined>).rebuild).toBeUndefined()
  })

  it('exposes the in-container dev command as dev:container', () => {
    expect(pkg.scripts['dev:container']).toBe('NODE_OPTIONS=--no-deprecation next dev')
  })

  it('wraps db:migrate through docker compose exec', () => {
    expect(pkg.scripts['db:migrate']).toBe(
      'sh ./scripts/ensure-payload-container.sh && docker compose exec -T payload pnpm db:migrate:container',
    )
    expect(pkg.scripts['db:migrate:container']).toBe('pnpm payload migrate')
  })

  it('wraps db:migrate:create through docker compose exec', () => {
    expect(pkg.scripts['db:migrate:create']).toBe(
      'sh ./scripts/ensure-payload-container.sh && docker compose exec -T payload pnpm db:migrate:create:container',
    )
    expect(pkg.scripts['db:migrate:create:container']).toBe('pnpm payload migrate:create')
  })

  it('wraps generate:importmap through docker compose exec', () => {
    expect(pkg.scripts['generate:importmap']).toBe(
      'sh ./scripts/ensure-payload-container.sh && docker compose exec -T payload pnpm generate:importmap:container',
    )
    expect(pkg.scripts['generate:importmap:container']).toBe(
      'NODE_OPTIONS=--no-deprecation payload generate:importmap',
    )
  })

  it('wraps generate:types through docker compose exec', () => {
    expect(pkg.scripts['generate:types']).toBe(
      'sh ./scripts/ensure-payload-container.sh && docker compose exec -T payload pnpm generate:types:container',
    )
    expect(pkg.scripts['generate:types:container']).toBe(
      'NODE_OPTIONS=--no-deprecation payload generate:types',
    )
  })

  it('wraps payload through docker compose exec', () => {
    expect(pkg.scripts.payload).toBe(
      'sh ./scripts/ensure-payload-container.sh && docker compose exec payload pnpm payload:container',
    )
    expect(pkg.scripts['payload:container']).toBe('NODE_OPTIONS=--no-deprecation payload')
  })

  it('wraps test through docker compose exec and chains int + e2e', () => {
    expect(pkg.scripts.test).toBe(
      'sh ./scripts/ensure-payload-container.sh && docker compose exec -T payload pnpm test:container',
    )
    expect(pkg.scripts['test:container']).toBe(
      'pnpm run test:int:container && pnpm run test:e2e:container',
    )
  })

  it('wraps test:int through docker compose exec', () => {
    expect(pkg.scripts['test:int']).toBe(
      'sh ./scripts/ensure-payload-container.sh && docker compose exec -T payload pnpm test:int:container',
    )
    expect(pkg.scripts['test:int:container']).toBe(
      'NODE_OPTIONS=--no-deprecation vitest run --config ./vitest.config.mts --project integration',
    )
  })

  it('wraps test:e2e through docker compose exec', () => {
    expect(pkg.scripts['test:e2e']).toBe(
      'sh ./scripts/ensure-payload-container.sh && docker compose exec -T payload pnpm test:e2e:container',
    )
    expect(pkg.scripts['test:e2e:container']).toBe(
      'NODE_OPTIONS="--no-deprecation --import=tsx/esm" playwright test --config=playwright.config.ts',
    )
  })

  it('uses non-interactive exec for non-interactive wrappers', () => {
    expect(pkg.scripts['db:migrate']).toContain('docker compose exec -T payload')
    expect(pkg.scripts['db:migrate:create']).toContain('docker compose exec -T payload')
    expect(pkg.scripts['generate:importmap']).toContain('docker compose exec -T payload')
    expect(pkg.scripts['generate:types']).toContain('docker compose exec -T payload')
    expect(pkg.scripts.test).toContain('docker compose exec -T payload')
    expect(pkg.scripts['test:int']).toContain('docker compose exec -T payload')
    expect(pkg.scripts['test:e2e']).toContain('docker compose exec -T payload')
  })

  it('keeps the interactive payload wrapper without -T', () => {
    expect(pkg.scripts.payload).not.toContain('docker compose exec -T payload')
  })
})

describe('docker-compose payload service', () => {
  it('starts the container with pnpm dev:container', () => {
    expect(dockerCompose).toContain('pnpm dev:container')
  })

  it('does not call pnpm dev directly from the payload service command', () => {
    expect(dockerCompose).not.toMatch(/^\s*pnpm dev\s*$/m)
  })
})
