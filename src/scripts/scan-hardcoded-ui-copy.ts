import { createHash } from 'crypto'
import fs from 'fs/promises'
import path from 'path'
import ts from 'typescript'
import { getPayload } from 'payload'

import config from '@payload-config'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type AppLocale } from '@/i18n/config'
import {
  SCANNER_DEFAULT_CI_THRESHOLD,
  SCANNER_DEFAULT_LOCALE,
  SCANNER_EXCLUDE_SUBSTRINGS,
  SCANNER_INCLUDE_ROOTS,
  SCANNER_MIRROR_TO_DEFAULT_LOCALE,
  SCANNER_REPORT_PATH,
  SCANNER_SOURCE_LOCALE,
  SCANNER_VISIBLE_PROPS,
} from '@/i18n/scannerConfig'

type ScanReason = 'literal' | 'dynamic-cms-expression' | 'ignored-pattern'

type ReportEntry = {
  column: number
  file: string
  group?: string
  line: number
  literal: string
  reason: ScanReason
  suggestedKey?: string
  usedIn?: string
}

type LiteralEntry = ReportEntry & {
  group: string
  reason: 'literal'
  suggestedKey: string
  usedIn: string
}

type ExistingUICopyDoc = {
  description?: string | null
  group?: string | null
  id: number
  translations?: Array<{
    id?: string | null
    locale?: string | null
    value?: string | null
  }> | null
  usedIn?: Array<string | null> | null
}

const args = process.argv.slice(2)
const shouldSeed = args.includes('--seed')
const dryRun = args.includes('--dry-run')
const ciMode = args.includes('--ci')
const maxLiteralsArg = args.find((arg) => arg.startsWith('--max-literals='))
const maxLiterals = maxLiteralsArg
  ? Number(maxLiteralsArg.split('=')[1] || SCANNER_DEFAULT_CI_THRESHOLD)
  : Number(process.env.I18N_HARDCODED_THRESHOLD || SCANNER_DEFAULT_CI_THRESHOLD)

const cwd = process.cwd()

const toPosix = (value: string): string => value.split(path.sep).join('/')

const normalizeVisibleText = (value: string): string => value.replace(/\s+/g, ' ').trim()

const normalizeComponentName = (filePath: string): string =>
  path.basename(filePath, path.extname(filePath)).replace(/[^a-zA-Z0-9]/g, '')

const normalizeFileStem = (filePath: string): string => {
  const base = path.basename(filePath, path.extname(filePath)).toLowerCase()
  const cleaned = base.replace(/[^a-z0-9]/g, '')
  return cleaned || 'component'
}

const resolveScope = (relativePath: string): string => {
  const lower = relativePath.toLowerCase()
  if (lower.includes('/homepage/')) return 'homepage'
  return 'shared'
}

const resolveGroup = (relativePath: string): string => {
  const lower = relativePath.toLowerCase()
  const stem = normalizeFileStem(relativePath)

  if (lower.includes('/components/homepage/')) {
    const compact = stem.replace(/section$/, '') || 'section'
    return `homepage.${compact}`
  }

  if (lower.includes('/header/')) return 'shared.header'
  if (lower.includes('/footer/')) return 'shared.footer'
  if (lower.includes('/app/(frontend)/not-found')) return 'shared.notfound'
  if (lower.includes('/app/(frontend)/search/')) return 'shared.search'

  return `shared.${stem}`
}

const buildSuggestedKey = (relativePath: string, literal: string): string => {
  const scope = resolveScope(relativePath)
  const stem = normalizeFileStem(relativePath)
  const shortHash = createHash('sha1')
    .update(`${relativePath}::${literal}`)
    .digest('hex')
    .slice(0, 6)

  return `auto.${scope}.${stem}.${shortHash}`
}

const isLikelyUserVisibleLiteral = (value: string): boolean => {
  if (!value) return false
  if (!/[\p{L}]/u.test(value)) return false
  if (/^(https?:\/\/|mailto:|tel:)/i.test(value)) return false
  if (/^[a-z0-9]+(?:\.[a-z0-9]+){2,}$/i.test(value)) return false
  return true
}

const isIncludedSourceFile = (absolutePath: string): boolean => {
  const rel = toPosix(path.relative(cwd, absolutePath))
  const lower = rel.toLowerCase()

  if (!/\.(tsx?|jsx?)$/.test(lower)) return false
  if (!SCANNER_INCLUDE_ROOTS.some((root) => lower.startsWith(root.toLowerCase()))) return false
  if (SCANNER_EXCLUDE_SUBSTRINGS.some((marker) => lower.includes(marker.toLowerCase()))) return false

  return true
}

const collectFiles = async (dir: string): Promise<string[]> => {
  const rootStat = await fs.stat(dir)

  if (rootStat.isFile()) {
    return isIncludedSourceFile(dir) ? [dir] : []
  }

  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(full)))
      continue
    }

    if (entry.isFile() && isIncludedSourceFile(full)) {
      files.push(full)
    }
  }

  return files
}

const detectScriptKind = (filePath: string): ts.ScriptKind => {
  if (filePath.endsWith('.tsx')) return ts.ScriptKind.TSX
  if (filePath.endsWith('.jsx')) return ts.ScriptKind.JSX
  if (filePath.endsWith('.ts')) return ts.ScriptKind.TS
  if (filePath.endsWith('.js')) return ts.ScriptKind.JS
  return ts.ScriptKind.TSX
}

const getLineAndColumn = (sourceFile: ts.SourceFile, position: number) => {
  const { line, character } = sourceFile.getLineAndCharacterOfPosition(position)
  return { column: character + 1, line: line + 1 }
}

const parentTextTagName = (node: ts.Node, sourceFile: ts.SourceFile): string | null => {
  let current: ts.Node | undefined = node.parent

  while (current) {
    if (ts.isJsxElement(current)) {
      return current.openingElement.tagName.getText(sourceFile).toLowerCase()
    }
    if (ts.isJsxSelfClosingElement(current)) {
      return current.tagName.getText(sourceFile).toLowerCase()
    }
    if (ts.isJsxFragment(current)) return null
    current = current.parent
  }

  return null
}

const textTagSet = new Set([
  'a',
  'button',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'label',
  'li',
  'p',
  'span',
  'summary',
])

const scanFile = async (absolutePath: string): Promise<ReportEntry[]> => {
  const source = await fs.readFile(absolutePath, 'utf8')
  const relativePath = toPosix(path.relative(cwd, absolutePath))
  const sourceFile = ts.createSourceFile(
    absolutePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    detectScriptKind(absolutePath),
  )
  const entries: ReportEntry[] = []
  const usedIn = normalizeComponentName(absolutePath)

  const pushLiteral = (literalRaw: string, start: number) => {
    const literal = normalizeVisibleText(literalRaw)
    if (!literal) return

    const { line, column } = getLineAndColumn(sourceFile, start)

    if (!isLikelyUserVisibleLiteral(literal)) {
      entries.push({
        column,
        file: relativePath,
        line,
        literal,
        reason: 'ignored-pattern',
      })
      return
    }

    entries.push({
      column,
      file: relativePath,
      group: resolveGroup(relativePath),
      line,
      literal,
      reason: 'literal',
      suggestedKey: buildSuggestedKey(relativePath, literal),
      usedIn,
    })
  }

  const visit = (node: ts.Node) => {
    if (ts.isJsxText(node)) {
      const parentTag = parentTextTagName(node, sourceFile)
      if (!parentTag || !textTagSet.has(parentTag)) {
        ts.forEachChild(node, visit)
        return
      }

      pushLiteral(node.getText(sourceFile), node.getStart(sourceFile))
    }

    if (ts.isJsxAttribute(node)) {
      const propName = node.name.getText(sourceFile)
      if (SCANNER_VISIBLE_PROPS.has(propName) && node.initializer && ts.isStringLiteral(node.initializer)) {
        pushLiteral(node.initializer.text, node.initializer.getStart(sourceFile))
      }
    }

    if (ts.isJsxExpression(node) && node.expression) {
      const parentTag = parentTextTagName(node, sourceFile)
      if (parentTag && textTagSet.has(parentTag)) {
        const expr = node.expression
        const isDynamicExpression =
          ts.isIdentifier(expr) ||
          ts.isPropertyAccessExpression(expr) ||
          ts.isElementAccessExpression(expr) ||
          ts.isConditionalExpression(expr)

        const isTranslatorCall =
          ts.isCallExpression(expr) &&
          ts.isIdentifier(expr.expression) &&
          expr.expression.text === 't'

        if (isDynamicExpression && !isTranslatorCall) {
          const { line, column } = getLineAndColumn(sourceFile, expr.getStart(sourceFile))
          entries.push({
            column,
            file: relativePath,
            line,
            literal: normalizeVisibleText(expr.getText(sourceFile)),
            reason: 'dynamic-cms-expression',
          })
        }
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)

  return entries
}

const ensureDir = async (filePath: string) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
}

const buildReport = (entries: ReportEntry[], filesScanned: number) => {
  const literalCount = entries.filter((entry) => entry.reason === 'literal').length
  const dynamicCount = entries.filter((entry) => entry.reason === 'dynamic-cms-expression').length
  const ignoredCount = entries.filter((entry) => entry.reason === 'ignored-pattern').length

  return {
    generatedAt: new Date().toISOString(),
    filesScanned,
    sourceLocale: SCANNER_SOURCE_LOCALE,
    defaultLocale: SCANNER_DEFAULT_LOCALE,
    totalEntries: entries.length,
    totals: {
      dynamicSkips: dynamicCount,
      ignoredPattern: ignoredCount,
      literals: literalCount,
    },
    entries,
  }
}

const uniqueLiteralEntries = (entries: ReportEntry[]): LiteralEntry[] => {
  const map = new Map<string, LiteralEntry>()

  for (const entry of entries) {
    if (entry.reason !== 'literal') continue

    const literalEntry = entry as LiteralEntry
    if (!map.has(literalEntry.suggestedKey)) {
      map.set(literalEntry.suggestedKey, literalEntry)
    }
  }

  return [...map.values()]
}

const normalizeText = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

const localeSupported = (locale: AppLocale): boolean => SUPPORTED_LOCALES.includes(locale)

const seedEntries = async (entries: LiteralEntry[]): Promise<{ created: number; updated: number }> => {
  const payload = await getPayload({ config })
  let created = 0
  let updated = 0

  const sourceLocale = SCANNER_SOURCE_LOCALE
  const defaultLocale = DEFAULT_LOCALE

  if (!localeSupported(sourceLocale)) {
    throw new Error(`Scanner source locale "${sourceLocale}" is not in SUPPORTED_LOCALES.`)
  }

  if (SCANNER_MIRROR_TO_DEFAULT_LOCALE && !localeSupported(defaultLocale)) {
    throw new Error(`Default locale "${defaultLocale}" is not in SUPPORTED_LOCALES.`)
  }

  for (const entry of entries) {
    const existing = await payload.find({
      collection: 'ui-copy-keys',
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        key: {
          equals: entry.suggestedKey,
        },
      },
    })

    const existingDoc = existing.docs[0] as ExistingUICopyDoc | undefined
    const seedDescription = `Auto-generated from ${entry.file}:${entry.line}`

    if (!existingDoc) {
      if (!dryRun) {
        const translations: Array<{ locale: AppLocale; value: string }> = [
          {
            locale: sourceLocale,
            value: entry.literal,
          },
        ]

        if (SCANNER_MIRROR_TO_DEFAULT_LOCALE && defaultLocale !== sourceLocale) {
          translations.push({
            locale: defaultLocale,
            value: entry.literal,
          })
        }

        await payload.create({
          collection: 'ui-copy-keys',
          context: {
            disableRevalidate: true,
          },
          data: {
            description: seedDescription,
            group: entry.group,
            isActive: true,
            key: entry.suggestedKey,
            translations,
            usedIn: [entry.usedIn],
          },
        })
      }

      created += 1
      continue
    }

    let changed = false
    const existingTranslations = Array.isArray(existingDoc.translations)
      ? [...existingDoc.translations]
      : []

    const ensureLocaleValue = (locale: AppLocale, value: string) => {
      const existingIndex = existingTranslations.findIndex(
        (translation) => normalizeText(translation?.locale) === locale,
      )

      if (existingIndex < 0) {
        existingTranslations.push({ locale, value })
        changed = true
        return
      }

      const current = normalizeText(existingTranslations[existingIndex]?.value)
      if (!current) {
        existingTranslations[existingIndex] = {
          ...existingTranslations[existingIndex],
          locale,
          value,
        }
        changed = true
      }
    }

    ensureLocaleValue(sourceLocale, entry.literal)

    if (SCANNER_MIRROR_TO_DEFAULT_LOCALE && defaultLocale !== sourceLocale) {
      ensureLocaleValue(defaultLocale, entry.literal)
    }

    const existingUsedIn = Array.isArray(existingDoc.usedIn)
      ? existingDoc.usedIn.map((value) => normalizeText(value)).filter(Boolean)
      : []
    if (!existingUsedIn.includes(entry.usedIn)) {
      existingUsedIn.push(entry.usedIn)
      changed = true
    }

    const nextGroup = normalizeText(existingDoc.group) || entry.group
    if (nextGroup !== normalizeText(existingDoc.group)) changed = true

    const nextDescription = normalizeText(existingDoc.description) || seedDescription
    if (nextDescription !== normalizeText(existingDoc.description)) changed = true

    if (!changed) continue

    if (!dryRun) {
      await payload.update({
        collection: 'ui-copy-keys',
        context: {
          disableRevalidate: true,
        },
        id: existingDoc.id,
        data: {
          description: nextDescription,
          group: nextGroup,
          key: entry.suggestedKey,
          translations: existingTranslations
            .map((translation) => {
              const locale = normalizeText(translation?.locale) as AppLocale
              const value = normalizeText(translation?.value)
              if (!locale || !value) return null
              if (!localeSupported(locale)) return null
              return { locale, value }
            })
            .filter(Boolean) as Array<{ locale: AppLocale; value: string }>,
          usedIn: existingUsedIn,
        },
      })
    }

    updated += 1
  }

  return { created, updated }
}

const run = async () => {
  const absoluteRoots = SCANNER_INCLUDE_ROOTS.map((root) => path.join(cwd, root))
  const rootFiles = await Promise.all(
    absoluteRoots.map(async (root) => {
      try {
        return await collectFiles(root)
      } catch {
        return []
      }
    }),
  )
  const files = rootFiles.flat().sort()
  const allEntries = (await Promise.all(files.map((file) => scanFile(file)))).flat()
  const report = buildReport(allEntries, files.length)

  await ensureDir(path.join(cwd, SCANNER_REPORT_PATH))
  await fs.writeFile(path.join(cwd, SCANNER_REPORT_PATH), JSON.stringify(report, null, 2), 'utf8')

  const literalEntries = uniqueLiteralEntries(allEntries)
  let seedResult = { created: 0, updated: 0 }

  if (shouldSeed) {
    seedResult = await seedEntries(literalEntries)
  }

  console.info(
    `[scan-hardcoded-ui-copy] files=${report.filesScanned} literals=${report.totals.literals} dynamic=${report.totals.dynamicSkips} ignored=${report.totals.ignoredPattern} seeded(created=${seedResult.created},updated=${seedResult.updated},dryRun=${dryRun}) report=${SCANNER_REPORT_PATH}`,
  )

  if (ciMode && report.totals.literals > maxLiterals) {
    console.error(
      `[scan-hardcoded-ui-copy] CI threshold exceeded: literals=${report.totals.literals} > max=${maxLiterals}`,
    )
    process.exit(1)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
