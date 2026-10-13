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

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) => RootPage({ config, importMap, params, searchParams })

export default Page
