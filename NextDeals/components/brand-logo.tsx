import Link from "@/components/localized-link"

type BrandLogoSize = "sm" | "md" | "lg"
type BrandLogoTone = "dark" | "light"

export interface BrandLogoProps {
  brandName?: string
  brandHighlight?: string
  /** CMS-uploaded logo; replaces the mark and wordmark when set. */
  customLogoUrl?: string
  size?: BrandLogoSize
  /** "dark" = dark text for light backgrounds, "light" = white text for dark backgrounds. */
  tone?: BrandLogoTone
  href?: string
  className?: string
}

const SIZES: Record<BrandLogoSize, { mark: string; text: string; gap: string; image: string }> = {
  sm: { mark: "h-7 w-7 rounded-lg", text: "text-lg", gap: "gap-2", image: "h-7" },
  md: { mark: "h-8 w-8 sm:h-9 sm:w-9 rounded-[10px]", text: "text-xl sm:text-2xl", gap: "gap-2 sm:gap-2.5", image: "h-8 sm:h-9" },
  lg: { mark: "h-10 w-10 rounded-xl", text: "text-2xl", gap: "gap-2.5", image: "h-10" },
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/** Brand mark: a coupon "%" on the brand gradient. Decorative; the wordmark carries the name. */
function BrandMark({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-600 shadow-sm shadow-violet-600/30 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" fill="none">
        <path d="M18 6 6 18" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="7.5" cy="7.5" r="2.6" stroke="white" strokeWidth="2.2" />
        <circle cx="16.5" cy="16.5" r="2.6" stroke="white" strokeWidth="2.2" />
      </svg>
    </span>
  )
}

export function BrandLogo({
  brandName = "Coupon",
  brandHighlight = "Kodee",
  customLogoUrl,
  size = "md",
  tone = "dark",
  href = "/",
  className = "",
}: BrandLogoProps) {
  const name = capitalize(brandName || "Coupon")
  const highlight = capitalize(brandHighlight || "Kodee")
  const sizes = SIZES[size]

  return (
    <Link
      href={href}
      aria-label={`${name}${highlight} home`}
      className={`inline-flex shrink-0 items-center rounded-lg ${sizes.gap} ${className}`}
    >
      {customLogoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={customLogoUrl} alt={`${name}${highlight}`} className={`${sizes.image} w-auto object-contain`} />
      ) : (
        <>
          <BrandMark className={sizes.mark} />
          <span className={`${sizes.text} font-extrabold leading-none tracking-tight whitespace-nowrap`}>
            <span className={tone === "light" ? "text-white" : "text-slate-900"}>{name}</span>
            <span className={tone === "light" ? "text-violet-300" : "text-violet-600"}>{highlight}</span>
          </span>
        </>
      )}
    </Link>
  )
}
