import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { defaultLexical } from '@/fields/defaultLexical'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/i18n/config'
import { Categories } from './collections/Categories'
import { FormRateLimits } from './collections/FormRateLimits'
import { Icons } from './collections/Icons'
import { LandingPages } from './collections/LandingPages'
import { LandingSections } from './collections/LandingSections'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { UICopyKeys } from './collections/UICopyKeys'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { getEmailAdapter } from './utilities/getEmailAdapter'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const emailAdapter = await getEmailAdapter()
const databaseURL = process.env.DATABASE_URL || ''

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: databaseURL,
      options: '-c search_path=public',
    },
  }),
  localization: {
    locales: SUPPORTED_LOCALES.map((locale) => ({
      code: locale,
      label: locale.toUpperCase(),
    })),
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
  },
  collections: [
    Icons,
    UICopyKeys,
    LandingSections,
    LandingPages,
    Pages,
    Posts,
    Media,
    Categories,
    FormRateLimits,
    Users,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  ...(emailAdapter ? { email: emailAdapter } : {}),
  globals: [Header, Footer],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
