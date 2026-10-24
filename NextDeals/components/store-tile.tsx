import Link from "@/components/localized-link"
import { BadgeCheck } from "lucide-react"
import { StoreLogoImage } from "@/components/store-logo-image"
import { getBrandLogo } from "@/lib/brand-logos"
import { formatOfferCount, getOfferCount } from "@/lib/offer-count"

export interface StoreTileStore {
  slug: string
  name: string
  initial: string
  bg?: string
  logoUrl?: string | null
  offers?: unknown[] | null
  couponsCount?: number | null
}

/**
 * Store name followed by a verified tick. The tick stays attached to the last
 * word, so long names wrap as "Amazon / Australia ✓" instead of orphaning the icon.
 */
export function VerifiedName({ name }: { name: string }) {
  const words = name.trim().split(/\s+/)
  const lastWord = words.pop()
  return (
    <>
      {words.length > 0 && `${words.join(" ")} `}
      <span className="whitespace-nowrap">
        {lastWord}
        <BadgeCheck aria-label="Verified store" className="ml-1 inline-block h-4 w-4 align-text-bottom text-emerald-600" />
      </span>
    </>
  )
}

/** Compact store card used in the "popular stores" strips on listing pages. */
export function StoreTile({ store }: { store: StoreTileStore }) {
  const logo = store.logoUrl || getBrandLogo(store.slug) || getBrandLogo(store.name)
  const offerLabel = formatOfferCount(getOfferCount(store))

  return (
    <Link
      href={`/store/${store.slug}`}
      className="group flex flex-col items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 text-center transition-all hover:border-purple-300 hover:shadow-sm"
    >
      {/* Mobile: name first, then logo and count */}
      <div className="flex w-full flex-col items-center justify-between gap-2 py-1 text-center sm:hidden">
        <span className="line-clamp-2 text-md font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-purple-700">
          <VerifiedName name={store.name} />
        </span>
        <div className="my-0.5 flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 bg-white p-1 shadow-2xs">
          <StoreLogoImage src={logo} alt={store.name} initial={store.initial} bg={store.bg} size="md" />
        </div>
        <span className="whitespace-nowrap text-xs font-semibold text-slate-500">{offerLabel}</span>
      </div>

      {/* Tablet and desktop: logo first */}
      <div className="hidden w-full flex-col items-center sm:flex">
        <StoreLogoImage
          src={logo}
          alt={store.name}
          initial={store.initial}
          bg={store.bg}
          size="md"
          className="mb-2 transition-transform group-hover:scale-105"
        />
        <span className="w-full truncate text-xs font-bold text-slate-900 group-hover:text-purple-700">{store.name}</span>
        <span className="mt-0.5 text-xs font-semibold text-slate-500">{offerLabel.toLowerCase()}</span>
      </div>
    </Link>
  )
}
