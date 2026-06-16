import * as migration_20260614_210456 from './20260614_210456'

export const migrations = [
  {
    up: migration_20260614_210456.up,
    down: migration_20260614_210456.down,
    name: '20260614_210456',
  },
]
