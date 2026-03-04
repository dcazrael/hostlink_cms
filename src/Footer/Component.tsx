import { getCachedGlobal } from '@/utilities/getGlobals'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { LocalizedLink } from '@/components/LocalizedLink'
import { Logo } from '@/components/Logo/Logo'
import { ThemeToggle } from '@/providers/Theme/ThemeToggle'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <LocalizedLink className="flex items-center" href="/">
          <Logo />
        </LocalizedLink>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeToggle />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-foreground" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
