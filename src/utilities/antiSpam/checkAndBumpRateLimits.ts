import type { PayloadRequest } from 'payload'

type WindowName = 'hour' | 'minute'

type CheckAndBumpRateLimitsArgs = {
  formID: number
  ipHash: string
  req: PayloadRequest
}

type WindowConfig = {
  limit: number
  name: WindowName
}

const toPositiveInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  if (parsed <= 0) return fallback
  return Math.floor(parsed)
}

const minuteLimit = toPositiveInt(process.env.SPAM_RATE_MINUTE_LIMIT, 5)
const hourLimit = toPositiveInt(process.env.SPAM_RATE_HOUR_LIMIT, 20)
const blockMinutes = toPositiveInt(process.env.SPAM_BLOCK_MINUTES, 30)

const windows: WindowConfig[] = [
  {
    limit: minuteLimit,
    name: 'minute',
  },
  {
    limit: hourLimit,
    name: 'hour',
  },
]

const getWindowStart = (windowName: WindowName, currentDate: Date): Date => {
  const windowStart = new Date(currentDate)

  if (windowName === 'minute') {
    windowStart.setSeconds(0, 0)
    return windowStart
  }

  windowStart.setMinutes(0, 0, 0)
  return windowStart
}

const hasActiveBlock = async ({
  formID,
  ipHash,
  now,
  req,
}: {
  formID: number
  ipHash: string
  now: Date
  req: PayloadRequest
}): Promise<boolean> => {
  const existingBlock = await req.payload.find({
    collection: 'form-rate-limits',
    depth: 0,
    limit: 1,
    pagination: false,
    req,
    where: {
      and: [
        {
          form: {
            equals: formID,
          },
        },
        {
          ipHash: {
            equals: ipHash,
          },
        },
        {
          blockedUntil: {
            greater_than: now.toISOString(),
          },
        },
      ],
    },
  })

  return existingBlock.docs.length > 0
}

export const checkAndBumpRateLimits = async ({
  formID,
  ipHash,
  req,
}: CheckAndBumpRateLimitsArgs): Promise<{ isRateLimited: boolean }> => {
  const now = new Date()
  const blockedUntil = new Date(now.getTime() + blockMinutes * 60_000)
  const hadActiveBlock = await hasActiveBlock({
    formID,
    ipHash,
    now,
    req,
  })

  let exceededLimit = false

  for (const window of windows) {
    const windowStart = getWindowStart(window.name, now)
    const key = `${formID}:${ipHash}:${window.name}:${windowStart.toISOString()}`

    const existing = await req.payload.find({
      collection: 'form-rate-limits',
      depth: 0,
      limit: 1,
      pagination: false,
      req,
      where: {
        key: {
          equals: key,
        },
      },
    })

    const currentRecord = existing.docs[0]
    const currentCount = typeof currentRecord?.count === 'number' ? currentRecord.count : 0
    const nextCount = currentCount + 1
    const windowExceeded = nextCount > window.limit

    if (windowExceeded) {
      exceededLimit = true
    }

    if (currentRecord) {
      await req.payload.update({
        collection: 'form-rate-limits',
        id: currentRecord.id,
        data: {
          blockedUntil: windowExceeded ? blockedUntil.toISOString() : currentRecord.blockedUntil || null,
          count: nextCount,
        },
        depth: 0,
        req,
      })
      continue
    }

    await req.payload.create({
      collection: 'form-rate-limits',
      data: {
        blockedUntil: windowExceeded ? blockedUntil.toISOString() : null,
        count: nextCount,
        form: formID,
        ipHash,
        key,
        window: window.name,
        windowStart: windowStart.toISOString(),
      },
      depth: 0,
      req,
    })
  }

  return {
    isRateLimited: hadActiveBlock || exceededLimit,
  }
}
