import { readFileSync } from 'node:fs'
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
