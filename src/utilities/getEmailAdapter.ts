import type { EmailAdapter } from 'payload'

type SMTPConfig = {
  host: string
  port: number
  secure: boolean
  requireTLS: boolean
  user: string
  pass: string
  fromAddress: string
  fromName: string
}

const getSMTPConfig = (): SMTPConfig | null => {
  const host = process.env.SMTP_HOST?.trim()
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()
  const fromAddress = process.env.SMTP_FROM_ADDRESS?.trim()

  if (!host || !user || !pass || !fromAddress) {
    return null
  }

  const parsedPort = Number(process.env.SMTP_PORT ?? 465)
  const port = Number.isFinite(parsedPort) ? parsedPort : 465
  const secure = process.env.SMTP_SECURE === 'true'
  const requireTLS = process.env.SMTP_REQUIRE_TLS === 'true'
  const fromName = process.env.SMTP_FROM_NAME?.trim() || 'HostLink'

  return {
    host,
    port,
    secure,
    requireTLS,
    user,
    pass,
    fromAddress,
    fromName,
  }
}

export const getEmailAdapter = async (): Promise<EmailAdapter | undefined> => {
  const smtp = getSMTPConfig()
  if (!smtp) {
    return undefined
  }

  try {
    const moduleName = '@payloadcms/email-nodemailer'
    const { nodemailerAdapter } = (await import(moduleName)) as {
      nodemailerAdapter: (args: {
        defaultFromAddress: string
        defaultFromName: string
        transportOptions: {
          auth: { user: string; pass: string }
          host: string
          port: number
          secure: boolean
          requireTLS: boolean
        }
      }) => EmailAdapter
    }

    return nodemailerAdapter({
      defaultFromAddress: smtp.fromAddress,
      defaultFromName: smtp.fromName,
      transportOptions: {
        auth: {
          user: smtp.user,
          pass: smtp.pass,
        },
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        requireTLS: smtp.requireTLS,
      },
    })
  } catch (error) {
    console.warn(
      '[payload] SMTP is configured but @payloadcms/email-nodemailer is missing. Run: pnpm add @payloadcms/email-nodemailer@3.78.0',
      error,
    )

    return undefined
  }
}
