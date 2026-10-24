/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from "next"

// If your config file is named 'payload.config.js' and located in the root, update the path:
import config from "../../../../src/payload.config"
// Or, if it's 'payload.config.ts':
// import config from "../../../../payload.config.ts"
// Or, if it's actually in another folder, adjust the path accordingly.
import { RootPage, generatePageMetadata } from "@payloadcms/next/views"
import { importMap } from "../importMap.js"
import { isDatabaseConfigured } from "@/src/lib/db-config"
import { isDatabaseReachable } from "@/src/lib/db-health"

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  if (!isDatabaseConfigured() || !(await isDatabaseReachable())) {
    return { title: 'Admin Setup Required | CouponKodee' }
  }

  try {
    return await generatePageMetadata({ config, params, searchParams })
  } catch {
    return { title: 'Admin Portal | CouponKodee' }
  }
}

const Page = async ({ params, searchParams }: Args) => {
  if (!isDatabaseConfigured() || !(await isDatabaseReachable())) {
    return null
  }

  return RootPage({ config, importMap, params, searchParams })
}

export default Page
