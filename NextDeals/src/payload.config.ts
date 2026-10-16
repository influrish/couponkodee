import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import {
  lexicalEditor,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
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
    url: (process.env.MONGODB_URI || process.env.DATABASE_URI) || false,
    connectOptions: {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
      bufferCommands: false,
    },
  }),
  ...(sharp ? { sharp } : {}),
  plugins: [
    payloadCloudPlugin(),
  ],
})