import Link from "@/components/localized-link"

export default function FrontendNotFound() {
  return (
    <div className="container py-24 text-center">
      <p className="text-sm font-bold text-purple-700 mb-2">404</p>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Page not found</h1>
      <p className="text-slate-600 mb-8">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/stores" className="px-5 py-2.5 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold transition-colors">
          Browse stores
        </Link>
        <Link href="/" className="px-5 py-2.5 rounded-full border border-slate-300 hover:border-purple-300 text-slate-700 text-sm font-bold transition-colors">
          Back to home
        </Link>
      </div>
    </div>
  )
}
