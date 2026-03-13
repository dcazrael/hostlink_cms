const normalizeKebabCase = (value: string): string => {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .trim()
}

export const getLucideNameCandidates = (value: string): string[] => {
  const trimmed = value.trim()
  if (!trimmed) return []

  const kebab = normalizeKebabCase(trimmed)
  const lower = trimmed.toLowerCase()

  return [...new Set([trimmed, lower, kebab].filter(Boolean))]
}
