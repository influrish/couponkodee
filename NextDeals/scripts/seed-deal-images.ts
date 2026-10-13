import fs from "fs"
import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })
import { getPayloadClient } from "../src/lib/payload"

const MEDIA_DIR = path.resolve(process.cwd(), "media")
const PUBLIC_DEALS_DIR = path.resolve(process.cwd(), "public/deals")

if (!fs.existsSync(MEDIA_DIR)) fs.mkdirSync(MEDIA_DIR, { recursive: true })
if (!fs.existsSync(PUBLIC_DEALS_DIR)) fs.mkdirSync(PUBLIC_DEALS_DIR, { recursive: true })

const dealBanners: Record<string, { filename: string; alt: string; merchant: string; svg: string }> = {
  samsung: {
    filename: "deal-samsung-4k-tv.svg",
    alt: "Samsung 4K Crystal UHD TV",
    merchant: "samsung",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
      <defs>
        <linearGradient id="bg-samsung" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0a192f"/>
          <stop offset="100%" stop-color="#1428A0"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#bg-samsung)"/>
      <rect x="70" y="30" width="260" height="150" rx="8" fill="#1e293b" stroke="#64748b" stroke-width="4"/>
      <rect x="78" y="38" width="244" height="134" rx="4" fill="#0f172a"/>
      <circle cx="200" cy="105" r="45" fill="#38bdf8" opacity="0.4"/>
      <path d="M120 145 C150 90, 250 80, 280 145 Z" fill="#818cf8" opacity="0.6"/>
      <text x="200" y="105" font-family="system-ui, sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle">4K CRYSTAL UHD</text>
      <rect x="185" y="180" width="30" height="20" fill="#475569"/>
      <rect x="155" y="200" width="90" height="8" rx="4" fill="#334155"/>
      <rect x="250" y="20" width="125" height="32" rx="16" fill="#f59e0b"/>
      <text x="312" y="42" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#111827" text-anchor="middle">45% OFF</text>
    </svg>`
  },
  swiggy: {
    filename: "deal-swiggy-one.svg",
    alt: "Swiggy Gourmet Food Delivery",
    merchant: "swiggy",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
      <defs>
        <linearGradient id="bg-swiggy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7c2d12"/>
          <stop offset="100%" stop-color="#FC8019"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#bg-swiggy)"/>
      <ellipse cx="200" cy="150" rx="90" ry="30" fill="#451a03" opacity="0.4"/>
      <path d="M140 140 C140 180, 260 180, 260 140 Z" fill="#FFFFFF"/>
      <path d="M145 138 Q200 80 255 138 Z" fill="#f59e0b"/>
      <rect x="135" y="135" width="130" height="12" rx="6" fill="#16a34a"/>
      <path d="M185 75 Q180 60 185 45 M200 70 Q205 55 200 40 M215 75 Q210 60 215 45" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8"/>
      <rect x="25" y="25" width="160" height="34" rx="17" fill="#FFFFFF"/>
      <text x="105" y="48" font-family="system-ui, sans-serif" font-weight="900" font-size="13" fill="#FC8019" text-anchor="middle">FREE DELIVERY</text>
      <text x="200" y="215" font-family="system-ui, sans-serif" font-weight="800" font-size="16" fill="#FFFFFF" text-anchor="middle">Swiggy One Special</text>
    </svg>`
  },
  nykaa: {
    filename: "deal-nykaa-perfumes.svg",
    alt: "Nykaa Luxury Fragrances",
    merchant: "nykaa",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
      <defs>
        <linearGradient id="bg-nykaa" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#831843"/>
          <stop offset="100%" stop-color="#ec4899"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#bg-nykaa)"/>
      <rect x="160" y="90" width="80" height="100" rx="16" fill="#fdf2f8" stroke="#fbcfe8" stroke-width="4"/>
      <rect x="180" y="65" width="40" height="25" fill="#f472b6"/>
      <rect x="185" y="45" width="30" height="20" rx="4" fill="#fbbf24"/>
      <circle cx="200" cy="140" r="22" fill="#ec4899" opacity="0.3"/>
      <text x="200" y="145" font-family="serif" font-style="italic" font-weight="900" font-size="16" fill="#831843" text-anchor="middle">EAU</text>
      <rect x="260" y="30" width="115" height="32" rx="16" fill="#fbbf24"/>
      <text x="317" y="52" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#831843" text-anchor="middle">40% OFF</text>
      <text x="200" y="218" font-family="system-ui, sans-serif" font-weight="800" font-size="15" fill="#FFFFFF" text-anchor="middle">Luxury Designer Perfumes</text>
    </svg>`
  },
  makemytrip: {
    filename: "deal-makemytrip-hotels.svg",
    alt: "MakeMyTrip Luxury Hotels",
    merchant: "makemytrip",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
      <defs>
        <linearGradient id="bg-mmt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0c4a6e"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#bg-mmt)"/>
      <circle cx="280" cy="70" r="35" fill="#facc15" opacity="0.9"/>
      <rect x="60" y="80" width="130" height="90" rx="8" fill="#f8fafc" opacity="0.95"/>
      <rect x="75" y="95" width="25" height="30" fill="#38bdf8"/>
      <rect x="110" y="95" width="25" height="30" fill="#38bdf8"/>
      <rect x="145" y="95" width="25" height="30" fill="#38bdf8"/>
      <path d="M0 170 Q100 160 200 170 T400 170 L400 240 L0 240 Z" fill="#0369a1"/>
      <path d="M0 190 Q100 180 200 190 T400 190 L400 240 L0 240 Z" fill="#0284c7" opacity="0.7"/>
      <rect x="250" y="125" width="125" height="34" rx="17" fill="#ef4444"/>
      <text x="312" y="148" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#FFFFFF" text-anchor="middle">FLAT 30% OFF</text>
      <text x="200" y="222" font-family="system-ui, sans-serif" font-weight="800" font-size="15" fill="#FFFFFF" text-anchor="middle">5-Star Luxury Resort Stays</text>
    </svg>`
  },
  myntra: {
    filename: "deal-myntra-fashion.svg",
    alt: "Myntra End of Reason Sale",
    merchant: "myntra",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
      <defs>
        <linearGradient id="bg-myntra" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4c0519"/>
          <stop offset="100%" stop-color="#e11d48"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#bg-myntra)"/>
      <g transform="translate(140, 45)">
        <polygon points="60,20 100,50 85,110 35,110 20,50" fill="#FFFFFF" opacity="0.9"/>
        <path d="M40 20 Q60 5 80 20" stroke="#f43f5e" stroke-width="4" fill="none"/>
      </g>
      <rect x="110" y="120" width="180" height="42" rx="8" fill="#facc15"/>
      <text x="200" y="147" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#1e1b4b" text-anchor="middle">UP TO 80% OFF</text>
      <text x="200" y="200" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">END OF REASON SALE</text>
    </svg>`
  },
  flipkart: {
    filename: "deal-flipkart-saving.svg",
    alt: "Flipkart Big Saving Days",
    merchant: "flipkart",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
      <defs>
        <linearGradient id="bg-fk" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e3a8a"/>
          <stop offset="100%" stop-color="#2563eb"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#bg-fk)"/>
      <circle cx="200" cy="110" r="75" fill="#3b82f6" opacity="0.4"/>
      <rect x="100" y="55" width="200" height="50" rx="12" fill="#ffe11b"/>
      <text x="200" y="87" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#1e3a8a" text-anchor="middle">BIG SAVING DAYS</text>
      <rect x="115" y="125" width="170" height="40" rx="20" fill="#FFFFFF"/>
      <text x="200" y="150" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#dc2626" text-anchor="middle">SAVE ₹10,000</text>
      <text x="200" y="205" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="#FFFFFF" text-anchor="middle">Mobiles, Laptops & Appliances</text>
    </svg>`
  },
  dominos: {
    filename: "deal-dominos-pizza.svg",
    alt: "Domino's Pizza Buy 1 Get 1 Free",
    merchant: "dominos",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
      <defs>
        <linearGradient id="bg-dominos" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#006491"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#bg-dominos)"/>
      <g transform="translate(150, 40)">
        <path d="M50 0 L100 120 C70 135, 30 135, 0 120 Z" fill="#f59e0b"/>
        <path d="M0 120 C30 135, 70 135, 100 120 L96 110 C68 125, 32 125, 4 110 Z" fill="#b45309"/>
        <circle cx="50" cy="55" r="10" fill="#dc2626"/>
        <circle cx="35" cy="85" r="9" fill="#dc2626"/>
        <circle cx="65" cy="90" r="9" fill="#dc2626"/>
      </g>
      <rect x="80" y="170" width="240" height="42" rx="21" fill="#e11d48"/>
      <text x="200" y="197" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#FFFFFF" text-anchor="middle">BUY 1 GET 1 FREE</text>
    </svg>`
  },
  boat: {
    filename: "deal-boat-smartwatch.svg",
    alt: "boAt Smartwatch Flash Deal",
    merchant: "boat",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
      <defs>
        <linearGradient id="bg-boat" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#450a0a"/>
          <stop offset="100%" stop-color="#991b1b"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#bg-boat)"/>
      <rect x="180" y="25" width="40" height="170" rx="8" fill="#1e293b"/>
      <rect x="160" y="60" width="80" height="100" rx="20" fill="#0f172a" stroke="#334155" stroke-width="4"/>
      <rect x="168" y="68" width="64" height="84" rx="14" fill="#020617"/>
      <text x="200" y="105" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#38bdf8" text-anchor="middle">10:48</text>
      <text x="200" y="128" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#22c55e" text-anchor="middle">12,450 steps</text>
      <rect x="255" y="30" width="120" height="34" rx="17" fill="#facc15"/>
      <text x="315" y="53" font-family="system-ui, sans-serif" font-weight="900" font-size="15" fill="#0f172a" text-anchor="middle">70% OFF</text>
      <text x="200" y="222" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="#FFFFFF" text-anchor="middle">Bluetooth Calling Smartwatches</text>
    </svg>`
  },
  ajio: {
    filename: "deal-ajio-sale.svg",
    alt: "Ajio Big Bold Sale",
    merchant: "ajio",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
      <defs>
        <linearGradient id="bg-ajio" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#090d16"/>
          <stop offset="100%" stop-color="#1e293b"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#bg-ajio)"/>
      <g transform="translate(100, 45)">
        <rect x="0" y="0" width="200" height="50" rx="8" fill="#e2e8f0"/>
        <text x="100" y="34" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#0f172a" text-anchor="middle" letter-spacing="3">BIG BOLD SALE</text>
      </g>
      <rect x="90" y="115" width="220" height="46" rx="23" fill="#e11d48"/>
      <text x="200" y="145" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle">50% - 80% OFF</text>
      <text x="200" y="200" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="#94a3b8" text-anchor="middle">Top International & Indian Fashion</text>
    </svg>`
  },
  amazon: {
    filename: "deal-amazon-electronics.svg",
    alt: "Amazon Electronics Mega Sale",
    merchant: "amazon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
      <defs>
        <linearGradient id="bg-amz" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#111827"/>
          <stop offset="100%" stop-color="#232f3e"/>
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#bg-amz)"/>
      <rect x="175" y="35" width="50" height="95" rx="8" fill="#374151" stroke="#9ca3af" stroke-width="2"/>
      <rect x="180" y="42" width="40" height="78" rx="4" fill="#1f2937"/>
      <circle cx="200" cy="112" r="4" fill="#9ca3af"/>
      <path d="M140 145 Q200 170 260 145" stroke="#f59e0b" stroke-width="5" fill="none" stroke-linecap="round"/>
      <rect x="110" y="165" width="180" height="38" rx="19" fill="#f59e0b"/>
      <text x="200" y="190" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#111827" text-anchor="middle">UP TO 60% OFF</text>
    </svg>`
  }
}

async function run() {
  console.log("Writing banner files...")
  for (const [key, banner] of Object.entries(dealBanners)) {
    const mediaPath = path.join(MEDIA_DIR, banner.filename)
    const publicPath = path.join(PUBLIC_DEALS_DIR, banner.filename)
    fs.writeFileSync(mediaPath, banner.svg.trim(), "utf8")
    fs.writeFileSync(publicPath, banner.svg.trim(), "utf8")
  }

  const payload = await getPayloadClient()

  // First create Media documents for each banner if not already existing
  const mediaMap: Record<string, any> = {}
  for (const [key, banner] of Object.entries(dealBanners)) {
    const existingMedia = await payload.find({
      collection: "media",
      where: { filename: { equals: banner.filename } },
      limit: 1,
    })

    if (existingMedia.docs.length > 0) {
      mediaMap[key] = existingMedia.docs[0]
      console.log(`Media exists for ${key}: ${existingMedia.docs[0].id}`)
    } else {
      const mediaDoc = await payload.create({
        collection: "media",
        data: {
          alt: banner.alt,
        },
        file: {
          data: Buffer.from(banner.svg),
          name: banner.filename,
          mimetype: "image/svg+xml",
          size: Buffer.byteLength(banner.svg),
        },
      })
      mediaMap[key] = mediaDoc
      console.log(`Created Media for ${key}: ${mediaDoc.id}`)
    }
  }

  // Update products with the created media IDs
  const products = await payload.find({ collection: "products", limit: 20 })
  for (const product of products.docs) {
    const merchantKey = (product.merchant || "").toLowerCase()
    const media = mediaMap[merchantKey]
    if (media) {
      await payload.update({
        collection: "products",
        id: product.id,
        data: {
          images: [
            {
              image: media.id,
              alt: media.alt || "Deal Image",
            },
          ],
        },
      })
      console.log(`Linked media ${media.id} to product "${product.title}"`)
    }
  }

  console.log("Done! All products now have deal banner images.")
}

run().catch(console.error).finally(() => process.exit(0))
