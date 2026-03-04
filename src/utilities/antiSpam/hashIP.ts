import { createHash } from 'crypto'

export const hashIP = (ip: string): string => {
  const salt = process.env.SPAM_IP_HASH_SALT || process.env.PAYLOAD_SECRET || 'hostlink-spam-salt'

  return createHash('sha256')
    .update(`${salt}:${ip}`)
    .digest('hex')
}
