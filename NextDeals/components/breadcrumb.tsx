import Link from "@/components/localized-link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  /** "bar" renders the full-width white strip used under the header on listing pages. */
  variant?: "inline" | "bar"
  className?: string
}

export function Breadcrumb({ items, variant = "inline", className = "" }: BreadcrumbProps) {
  const trail = (
    <nav aria-label="Breadcrumb" className={variant === "inline" ? className : undefined}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1
          return (
            <li key={`${index}-${item.href}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 && <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" />}
              <Link
                href={item.href}
                aria-current={isCurrent ? "page" : undefined}
                className={`truncate ${isCurrent ? "max-w-[16rem] font-medium text-foreground" : "hover:text-primary"}`}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )

  if (variant === "bar") {
    return (
      <div className={`border-b border-slate-200 bg-white ${className}`}>
        <div className="container py-3">{trail}</div>
      </div>
    )
  }

  return trail
}
