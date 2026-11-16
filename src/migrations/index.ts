import * as migration_20260614_210456 from './20260614_210456';
import * as migration_20261116_231630_dependency_upgrade from './20261116_231630_dependency_upgrade';

export const migrations = [
  {
    up: migration_20260614_210456.up,
    down: migration_20260614_210456.down,
    name: '20260614_210456',
  },
  {
    up: migration_20261116_231630_dependency_upgrade.up,
    down: migration_20261116_231630_dependency_upgrade.down,
    name: '20261116_231630_dependency_upgrade'
  },
];
