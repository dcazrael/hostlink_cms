import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

const script = resolve('scripts/deploy-vps.sh')

function deploy({ table = 't', marker = '1', fail = '', args = [] } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'hostlink-deploy-'))
  try {
    mkdirSync(join(dir, 'bin'))
    mkdirSync(join(dir, 'scripts'))
    const executable = (path, text) => writeFileSync(join(dir, path), text, { mode: 0o755 })
    executable('bin/git', '#!/bin/sh\nexit 0\n')
    executable('bin/docker', `#!/usr/bin/env node
const args = process.argv.slice(2)
const text = args.join(' ')
require('node:fs').appendFileSync(process.env.LOG, JSON.stringify(args) + '\\n')
if (process.env.FAIL && text.includes(process.env.FAIL)) process.exit(1)
if (text.includes('to_regclass')) console.log(process.env.TABLE)
else if (text.includes('SELECT 1 FROM payload_migrations WHERE batch')) console.log(process.env.MARKER)
`)
    executable('scripts/create-db-restore-point.sh', '#!/bin/sh\necho \'"backup"\' >> "$LOG"\n[ "$FAIL" != backup ]\n')
    writeFileSync(join(dir, '.env.production'), 'POSTGRES_USER=test\nDATABASE_URL=postgres://test\n')
    writeFileSync(join(dir, 'docker-compose.vps.yml'), '')
    const result = spawnSync('bash', [script, ...args], {
      cwd: dir,
      env: { ...process.env, PATH: `${join(dir, 'bin')}:${process.env.PATH}`, LOG: join(dir, 'log'), TABLE: table, MARKER: marker, FAIL: fail },
      encoding: 'utf8',
      timeout: 10000,
    })
    const calls = existsSync(join(dir, 'log'))
      ? readFileSync(join(dir, 'log'), 'utf8').trim().split('\n').map(JSON.parse)
      : []
    return { result, calls, text: calls.map((call) => Array.isArray(call) ? call.join(' ') : call).join('\n') }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

test('legacy cutover backs up first, atomically baselines, then runs direct container migrations', () => {
  const { result, calls, text } = deploy()
  assert.equal(result.status, 0, result.stderr)
  const sql = calls.find((call) => Array.isArray(call) && call.some((arg) => arg.includes('BEGIN;')))
  assert.ok(sql)
  assert.match(sql.at(-1), /BEGIN;[\s\S]*INSERT INTO payload_migrations[\s\S]*WHERE NOT EXISTS[\s\S]*DELETE FROM payload_migrations WHERE batch = -1;[\s\S]*COMMIT;/)
  assert.match(sql.at(-1), /20260614_210456/)
  assert.ok(text.indexOf('backup') < text.indexOf('BEGIN;'))
  assert.ok(text.indexOf('COMMIT;') < text.indexOf('run --rm -T migrator pnpm run payload:container migrate'))
  assert.doesNotMatch(text, /pnpm payload migrate/)
})

for (const [name, options] of [
  ['fresh database', { table: 'f' }],
  ['database without legacy marker', { marker: '' }],
]) {
  test(`${name} runs migrations without rewriting migration history`, () => {
    const { result, text } = deploy(options)
    assert.equal(result.status, 0, result.stderr)
    assert.doesNotMatch(text, /INSERT INTO|DELETE FROM/)
    assert.match(text, /run --rm -T migrator pnpm run payload:container migrate/)
  })
}

for (const fail of ['backup', 'to_regclass', 'BEGIN;', 'run --rm -T migrator']) {
  test(`failure at ${fail} prevents website replacement`, () => {
    const { result, text } = deploy({ fail })
    assert.notEqual(result.status, 0)
    assert.doesNotMatch(text, /up -d --build/)
    if (fail === 'backup') assert.doesNotMatch(text, /INSERT INTO|DELETE FROM/)
  })
}

test('skip-db-migrate leaves migration history untouched', () => {
  const { result, text } = deploy({ args: ['--skip-db-migrate'] })
  assert.equal(result.status, 0, result.stderr)
  assert.doesNotMatch(text, /psql|backup|run --rm/)
})

test('cannot bypass the required backup', () => {
  const { result, calls } = deploy({ args: ['--skip-db-backup'] })
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Unknown argument: --skip-db-backup/)
  assert.deepEqual(calls, [])
})
