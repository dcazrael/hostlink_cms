import type { PayloadRequest } from 'payload'

const readHeader = (req: PayloadRequest, name: string): string | null => {
  const headers = req.headers

  if (!headers) return null

  if (typeof headers.get === 'function') {
    return headers.get(name)
  }

  const lowerName = name.toLowerCase()
  const headerValue = (headers as unknown as Record<string, string | string[] | undefined>)[
    lowerName
  ]

  if (Array.isArray(headerValue)) return headerValue[0] || null
  return headerValue || null
}

export const getClientIP = (req: PayloadRequest): string => {
  const cfConnectingIP = readHeader(req, 'cf-connecting-ip')
  if (cfConnectingIP) return cfConnectingIP.trim()

  const xForwardedFor = readHeader(req, 'x-forwarded-for')
  if (xForwardedFor) {
    const forwardedIP = xForwardedFor.split(',')[0]?.trim()
    if (forwardedIP) return forwardedIP
  }

  const xRealIP = readHeader(req, 'x-real-ip')
  if (xRealIP) return xRealIP.trim()

  const directIP = (req as { ip?: string }).ip
  if (typeof directIP === 'string' && directIP.length > 0) return directIP

  return '0.0.0.0'
}
