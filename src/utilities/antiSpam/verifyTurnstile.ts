import type { PayloadRequest } from 'payload'

type VerifyTurnstileArgs = {
  ip: string
  req: PayloadRequest
  token: string
}

type TurnstileResponse = {
  'error-codes'?: string[]
  success?: boolean
}

export const verifyTurnstile = async ({ ip, req, token }: VerifyTurnstileArgs): Promise<boolean> => {
  const secret = process.env.TURNSTILE_SECRET_KEY

  if (!secret) {
    req.payload.logger.error({
      msg: '[anti-spam] TURNSTILE_SECRET_KEY is not set. Rejecting captcha verification.',
    })
    return false
  }

  try {
    const body = new URLSearchParams({
      response: token,
      secret,
    })

    if (ip && ip !== '0.0.0.0') {
      body.set('remoteip', ip)
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
      cache: 'no-store',
    })

    if (!response.ok) {
      req.payload.logger.warn({
        msg: `[anti-spam] Turnstile verification HTTP failure (${response.status}).`,
      })
      return false
    }

    const payload = (await response.json()) as TurnstileResponse
    const success = payload?.success === true

    if (!success) {
      req.payload.logger.warn({
        errorCodes: payload?.['error-codes'] || [],
        msg: '[anti-spam] Turnstile verification failed.',
      })
    }

    return success
  } catch (error) {
    req.payload.logger.error({
      err: error,
      msg: '[anti-spam] Turnstile verification threw an error.',
    })
    return false
  }
}
