"use client"

import NextLink from "next/link"
import { forwardRef, type ComponentProps } from "react"
import { useCountry } from "@/components/country-context"
import { localizeHref } from "@/lib/regions"

type LinkProps = ComponentProps<typeof NextLink>

/**
 * Drop-in replacement for next/link on the storefront: internal paths get the
 * active region prefix (/stores -> /in/stores). External URLs, /admin, /api,
 * /out and static files are left untouched.
 */
const LocalizedLink = forwardRef<HTMLAnchorElement, LinkProps>(function LocalizedLink({ href, ...props }, ref) {
  const { region } = useCountry()

  const localized =
    typeof href === "string"
      ? localizeHref(href, region)
      : href.pathname
        ? { ...href, pathname: localizeHref(href.pathname, region) }
        : href

  return <NextLink ref={ref} href={localized} {...props} />
})

export default LocalizedLink
