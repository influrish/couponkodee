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

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URI || ''
  const isInvalidMongo =
    !mongoUri ||
    mongoUri.includes('127.0.0.1') ||
    mongoUri.includes('localhost') ||
    mongoUri.includes('<username>') ||
    mongoUri.includes('...')

  if (isInvalidMongo) {
    return { title: 'Admin Setup Required | CouponKodee' }
  }

  try {
    return await generatePageMetadata({ config, params, searchParams })
  } catch {
    return { title: 'Admin Portal | CouponKodee' }
  }
}

const Page = async ({ params, searchParams }: Args) => {
  const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URI || ''
  const isInvalidMongo =
    !mongoUri ||
    mongoUri.includes('127.0.0.1') ||
    mongoUri.includes('localhost') ||
    mongoUri.includes('<username>') ||
    mongoUri.includes('...')

  if (isInvalidMongo) {
    return null
  }

  return RootPage({ config, importMap, params, searchParams })
}

export default Page
