import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    autoLogin: false,
    importMap: {
      baseDir: path.resolve(dirname),
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
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
  ],
})