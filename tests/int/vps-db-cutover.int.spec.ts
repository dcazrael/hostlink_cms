import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('vps-db-cutover script', () => {
  it('runs direct SQL through the postgres service instead of the migrator image', () => {
    const script = readFileSync(resolve(process.cwd(), 'scripts/vps-db-cutover.sh'), 'utf8')

    expect(script).toContain('exec -T postgres psql')
    expect(script).not.toContain('run --rm migrator sh -c')
  })
})
