import {
  APIError,
  ValidationError,
  type CollectionBeforeChangeHook,
  type CollectionBeforeValidateHook,
} from 'payload'

import { checkAndBumpRateLimits } from '@/utilities/antiSpam/checkAndBumpRateLimits'
import { getClientIP } from '@/utilities/antiSpam/getClientIP'
import { hashIP } from '@/utilities/antiSpam/hashIP'
import { verifyTurnstile } from '@/utilities/antiSpam/verifyTurnstile'

const HONEYPOT_FIELD = 'spam_hp'
const STARTED_AT_FIELD = 'spam_startedAt'
const TURNSTILE_TOKEN_FIELD = 'spam_turnstileToken'

const legacyFieldAliases = {
  honeypot: '__hp',
  startedAt: '__startedAt',
  turnstileToken: '__turnstileToken',
}

const metadataFields = new Set<string>([
  HONEYPOT_FIELD,
  STARTED_AT_FIELD,
  TURNSTILE_TOKEN_FIELD,
  legacyFieldAliases.honeypot,
  legacyFieldAliases.startedAt,
  legacyFieldAliases.turnstileToken,
])

const parsedMinSubmitMilliseconds = Number(process.env.SPAM_MIN_SUBMIT_MS || 2500)
const minSubmitMilliseconds =
  Number.isFinite(parsedMinSubmitMilliseconds) && parsedMinSubmitMilliseconds > 0
    ? parsedMinSubmitMilliseconds
    : 2500

type SubmissionDataItem = {
  field?: unknown
  value?: unknown
}

type SubmissionWithMetadata = {
  form?: unknown
  submissionData?: SubmissionDataItem[]
}

const toSubmissionMap = (submissionData: SubmissionDataItem[]): Map<string, unknown> => {
  const values = new Map<string, unknown>()

  for (const entry of submissionData) {
    if (typeof entry?.field !== 'string') continue
    values.set(entry.field, entry.value)
  }

  return values
}

const getFormID = (rawFormValue: unknown): number | null => {
  if (typeof rawFormValue === 'number' && Number.isFinite(rawFormValue)) return rawFormValue

  if (typeof rawFormValue === 'string' && rawFormValue.trim().length > 0) {
    const parsed = Number(rawFormValue)
    return Number.isFinite(parsed) ? parsed : null
  }

  if (rawFormValue && typeof rawFormValue === 'object' && 'id' in rawFormValue) {
    const maybeID = (rawFormValue as { id?: unknown }).id

    if (typeof maybeID === 'number' && Number.isFinite(maybeID)) return maybeID

    if (typeof maybeID === 'string' && maybeID.trim().length > 0) {
      const parsed = Number(maybeID)
      return Number.isFinite(parsed) ? parsed : null
    }
  }

  return null
}

const getTrimmedString = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

const getStartedAt = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

export const beforeValidateFormSubmissionAntiSpam: CollectionBeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create') return data

  const formData = (data || {}) as SubmissionWithMetadata
  const formID = getFormID(formData.form)
  const submissionData = Array.isArray(formData.submissionData) ? formData.submissionData : []

  if (!formID) return data

  const submissionMap = toSubmissionMap(submissionData)
  const honeypotValue = getTrimmedString(
    submissionMap.get(HONEYPOT_FIELD) ?? submissionMap.get(legacyFieldAliases.honeypot),
  )
  const startedAt = getStartedAt(
    submissionMap.get(STARTED_AT_FIELD) ?? submissionMap.get(legacyFieldAliases.startedAt),
  )
  const turnstileToken = getTrimmedString(
    submissionMap.get(TURNSTILE_TOKEN_FIELD) ?? submissionMap.get(legacyFieldAliases.turnstileToken),
  )

  const clientIP = getClientIP(req)
  const ipHash = hashIP(clientIP)

  const { isRateLimited } = await checkAndBumpRateLimits({
    formID,
    ipHash,
    req,
  })

  if (isRateLimited) {
    throw new APIError('RATE_LIMITED', 429)
  }

  const isTooFast = startedAt === null ? true : Date.now() - startedAt < minSubmitMilliseconds
  const isSuspicious = honeypotValue.length > 0 || isTooFast

  if (!isSuspicious) return data

  if (!turnstileToken) {
    req.payload.logger.info({
      hasHoneypot: honeypotValue.length > 0,
      hasStartedAt: startedAt !== null,
      keys: Array.from(submissionMap.keys()),
      msg: '[anti-spam] CAPTCHA_REQUIRED because token was missing in submission metadata.',
    })
    throw new ValidationError({
      collection: 'form-submissions',
      errors: [
        {
          path: 'submissionData',
          message: 'CAPTCHA_REQUIRED',
        },
      ],
      req,
    })
  }

  req.payload.logger.info({
    msg: '[anti-spam] Captcha token present. Verifying token.',
  })

  const captchaValid = await verifyTurnstile({
    ip: clientIP,
    req,
    token: turnstileToken,
  })

  if (!captchaValid) {
    throw new ValidationError({
      collection: 'form-submissions',
      errors: [
        {
          path: 'submissionData',
          message: 'CAPTCHA_INVALID',
        },
      ],
      req,
    })
  }

  req.payload.logger.info({
    msg: '[anti-spam] Captcha token verified successfully.',
  })

  return data
}

export const beforeChangeStripFormSubmissionAntiSpamMetadata: CollectionBeforeChangeHook = ({
  data,
}) => {
  if (!Array.isArray(data?.submissionData)) return data

  const sanitizedSubmissionData = data.submissionData.filter((entry) => {
    if (typeof entry?.field !== 'string') return false
    return !metadataFields.has(entry.field)
  })

  return {
    ...data,
    submissionData: sanitizedSubmissionData,
  }
}
