import { mongooseAdapter } from '@payloadcms/db-mongodb'
import {
  lexicalEditor,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { getDatabaseUri, isCloudflareRuntime, isDatabaseConfigured } from './lib/db-config'
let sharp: any = undefined
try {
  sharp = (await import('sharp')).default
} catch {
  // Sharp native bindings are not supported in Cloudflare Workers runtime
}

// Use dynamic imports to avoid circular dependencies
const Users = (await import('./collections/Users')).Users
const Media = (await import('./collections/Media')).Media
const Categories = (await import('./collections/Categories')).Categories
const NewsletterSubscribers = (await import('./collections/NewsletterSubscribers')).NewsletterSubscribers
const PriceHistory = (await import('./collections/PriceHistory')).PriceHistory
const Products = (await import('./collections/Products')).Products
const CouponOffers = (await import('./collections/CouponOffers')).CouponOffers
const CashbackOffers = (await import('./collections/CashbackOffers')).CashbackOffers
const Stores = (await import('./collections/Stores')).Stores
const Pages = (await import('./collections/Pages')).Pages
const ContactMessages = (await import('./collections/ContactMessages')).ContactMessages

// Globals for Header, Footer & Site/Homepage Settings
const Header = (await import('./globals/Header')).Header
const Footer = (await import('./globals/Footer')).Footer
const SiteSettings = (await import('./globals/SiteSettings')).SiteSettings

let dirname = ''
try {
  if (typeof import.meta !== 'undefined' && typeof import.meta.url === 'string' && import.meta.url.startsWith('file:')) {
    dirname = path.dirname(fileURLToPath(import.meta.url))
  }
} catch {
  // Edge / Cloudflare Worker runtime
}

export default buildConfig({
  admin: {
    user: 'users',
    autoLogin: false,
    meta: {
      titleSuffix: ' | CouponKodee Admin',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/brand-mark.svg' }],
    },
    components: {
      graphics: {
        Logo: '/components/admin/AdminBrand#AdminLogo',
        Icon: '/components/admin/AdminBrand#AdminIcon',
      },
    },
    importMap: {
      baseDir: dirname ? path.resolve(dirname) : process.cwd(),
    },
  },
  collections: [
    Users,
    Stores,
    CouponOffers,
    Products,
    CashbackOffers,
    Categories,
    Pages,
    Media,
    NewsletterSubscribers,
    ContactMessages,
    PriceHistory,
  ],
  globals: [
    Header,
    Footer,
    SiteSettings,
  ],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      InlineToolbarFeature(),
      HeadingFeature({
        enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: dirname ? path.resolve(dirname, 'payload-types.ts') : path.resolve(process.cwd(), 'src/payload-types.ts'),
  },
  db: mongooseAdapter({
    url: isDatabaseConfigured() ? getDatabaseUri() : false,
    connectOptions: {
      // Short on Workers to avoid request timeouts. Locally a busy machine (dev compiles,
      // hot-reload reconnects) can exceed 3s, and a failed connect makes Payload exit the process.
      serverSelectionTimeoutMS: isCloudflareRuntime() ? 3000 : 10000,
      connectTimeoutMS: isCloudflareRuntime() ? 3000 : 10000,
      bufferCommands: false,
    },
  }),
  ...(sharp ? { sharp } : {}),
})
