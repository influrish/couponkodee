import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { getCmsPage } from "@/lib/cms-settings"

interface DynamicPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getCmsPage(slug)

  if (!page) {
    return {
      title: "Page Not Found | CouponKodee",
    }
  }

  return {
    title: page.metaTitle || `${page.title} | CouponKodee`,
    description:
      page.metaDescription ||
      page.subtitle ||
      `Read ${page.title} on CouponKodee - India's leading cashback & coupons platform.`,
  }
}

export default async function DynamicCmsPage({ params }: DynamicPageProps) {
  const { slug } = await params
  const page = await getCmsPage(slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="container py-8 max-w-4xl min-h-[60vh]">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: page.title, href: `/p/${page.slug}` },
        ]}
      />

      <article className="space-y-8 mt-6">
        <header className="border-b border-slate-200 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              {page.subtitle}
            </p>
          )}
        </header>

        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-md whitespace-pre-wrap">
          {page.body}
        </div>
      </article>
    </div>
  )
}

