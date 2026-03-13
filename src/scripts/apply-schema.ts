import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'

type DrizzleLikeAdapter = {
  drizzle?: unknown
  execute?: (args: { drizzle?: unknown; raw: string }) => Promise<{ rows?: unknown[] }>
  extensions?: {
    postgis?: boolean
  }
  logger?: {
    info?: (message: string) => void
    warn?: (message: string) => void
  }
  payload?: {
    logger?: {
      info?: (message: string) => void
      warn?: (message: string) => void
    }
  }
  rawTables?: Record<string, unknown>
  requireDrizzleKit?: () => {
    pushSchema: (
      schema: Record<string, unknown>,
      drizzle: unknown,
      filterSchema?: string[],
      tablesFilter?: string[],
      extensionsFilter?: string[],
    ) => Promise<{ apply: () => Promise<void>; hasDataLoss: boolean; warnings: string[] }>
  }
  schema?: Record<string, unknown>
  schemaName?: string
  tables?: {
    payload_migrations?: unknown
  }
  tablesFilter?: string[]
}

const logInfo = (adapter: DrizzleLikeAdapter, message: string) => {
  adapter.payload?.logger?.info?.(message)
  adapter.logger?.info?.(message)
  if (!adapter.payload?.logger?.info && !adapter.logger?.info) {
    console.log(message)
  }
}

const logWarn = (adapter: DrizzleLikeAdapter, message: string) => {
  adapter.payload?.logger?.warn?.(message)
  adapter.logger?.warn?.(message)
  if (!adapter.payload?.logger?.warn && !adapter.logger?.warn) {
    console.warn(message)
  }
}

const run = async () => {
  const payload = await getPayload({ config })
  const adapter = payload.db as DrizzleLikeAdapter
  const autoAcceptWarnings = process.argv.includes('--yes')

  try {
    if (!adapter?.requireDrizzleKit || !adapter?.drizzle || !adapter?.schema) {
      throw new Error('Active DB adapter does not support Drizzle schema push.')
    }

    const { pushSchema } = adapter.requireDrizzleKit()
    const extensionsFilter = adapter.extensions?.postgis ? ['postgis'] : undefined
    const filterSchema = adapter.schemaName ? [adapter.schemaName] : undefined

    logInfo(
      adapter,
      autoAcceptWarnings
        ? '[apply-schema] Starting non-interactive schema push (--yes)...'
        : '[apply-schema] Starting schema push (safe mode)...',
    )

    const { apply, hasDataLoss, warnings } = await pushSchema(
      adapter.schema,
      adapter.drizzle,
      filterSchema,
      adapter.tablesFilter,
      extensionsFilter,
    )

    if (warnings.length > 0) {
      const joinedWarnings = warnings.map((warning) => `- ${warning}`).join('\n')
      logWarn(adapter, `[apply-schema] Drizzle warnings:\n${joinedWarnings}`)

      if (!autoAcceptWarnings) {
        throw new Error(
          '[apply-schema] Warnings detected. Re-run with --yes to apply schema changes non-interactively.',
        )
      }

      if (hasDataLoss) {
        logWarn(
          adapter,
          '[apply-schema] DATA LOSS WARNING detected. Applying anyway (non-interactive mode).',
        )
      }
    }

    await apply()

    // Keep parity with pushDevSchema bookkeeping for batch=-1 marker.
    const migrationsTable = adapter.schemaName
      ? `"${adapter.schemaName}"."payload_migrations"`
      : '"payload_migrations"'

    if (adapter.execute && adapter.tables?.payload_migrations && typeof adapter.drizzle === 'object') {
      const result = await adapter.execute({
        drizzle: adapter.drizzle,
        raw: `SELECT * FROM ${migrationsTable} WHERE batch = '-1'`,
      })

      const hasDevPushMarker = Array.isArray(result.rows) && result.rows.length > 0

      if (!hasDevPushMarker) {
        const drizzle = adapter.drizzle as {
          insert?: (table: unknown) => { values?: (value: Record<string, unknown>) => Promise<unknown> }
        }
        await drizzle.insert?.(adapter.tables.payload_migrations)?.values?.({
          name: 'dev',
          batch: -1,
        })
      } else {
        await adapter.execute({
          drizzle: adapter.drizzle,
          raw: `UPDATE ${migrationsTable} SET updated_at = CURRENT_TIMESTAMP WHERE batch = '-1'`,
        })
      }
    }

    logInfo(adapter, '[apply-schema] Schema push complete.')
  } finally {
    try {
      await payload.destroy()
    } catch (destroyError) {
      console.warn('[apply-schema] Failed to close Payload cleanly:', destroyError)
    }
  }
}

run()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
