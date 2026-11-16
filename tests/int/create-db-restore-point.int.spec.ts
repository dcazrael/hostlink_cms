import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('create-db-restore-point script', () => {
  it('does not pass a shell function to timeout', () => {
    const script = readFileSync(
      resolve(process.cwd(), 'scripts/create-db-restore-point.sh'),
      'utf8',
    )

    expect(script).not.toContain('timeout "$TIMEOUT" compose_cmd')
  })
})

describe('deploy-vps script surface', () => {
  it('keeps deploy-vps as the only normal operator entrypoint', () => {
    const script = readFileSync(resolve(process.cwd(), 'scripts/deploy-vps.sh'), 'utf8')

    expect(script).not.toContain('./scripts/vps-db-migrate.sh')
    expect(script).toContain('pnpm run payload:container migrate')
    expect(script).toContain('./scripts/create-db-restore-point.sh')
  })
})

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

  it('preserves the local-to-VPS cutover sequence in the runbook', () => {
    const runbook = readFileSync(resolve(process.cwd(), 'docs/deployment-vps.md'), 'utf8')

    // 1) local dump
    expect(runbook).toContain('pnpm db:restore-point')
    // 2) VPS restore point
    expect(runbook).toContain('./scripts/create-db-restore-point.sh')
    // 3) restore into VPS DB
    expect(runbook).toContain('--clean --if-exists')
    // 4) deploy with --skip-db-migrate
    expect(runbook).toContain('./scripts/deploy-vps.sh --branch main --skip-db-migrate')
  })
})

describe('CI deploy workflow', () => {
  it('keeps CI wording aligned with the simplified deploy flow', () => {
    const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/deploy.yml'), 'utf8')

    // Current intended messaging
    expect(workflow).toContain('Check schema and migration coherence')
    expect(workflow).toContain('migrations will run on deploy')
    expect(workflow).toContain('Schema-sensitive files changed but no migration file found')

    // Reject pre-simplification wording
    expect(workflow).not.toContain('apply-schema.ts will run automatically')
  })
})
