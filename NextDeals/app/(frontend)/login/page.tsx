"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { useCashbackVisibility } from "@/components/cashback-context"
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  EyeOff,
  Flame,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/"
  const isCashbackEnabled = useCashbackVisibility()

  const { login, user } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If already logged in, redirect
  if (user) {
    router.replace(redirectUrl)
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError("Please enter both email and password.")
      return
    }

    setIsSubmitting(true)
    const result = await login(email, password)
    setIsSubmitting(false)

    if (result.success) {
      router.push(redirectUrl)
    } else {
      setError(result.error || "Invalid email or password.")
    }
  }

  const fillDemoAdmin = () => {
    setEmail("admin@couponkodee.com")
    setPassword("admin123")
    setError(null)
  }

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Perks & Branding Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 font-black text-white text-lg shadow-md group-hover:scale-105 transition-transform">
                CK
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Coupon<span className="text-purple-400">Kodee</span>
              </span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-800/60 border border-purple-600/40 text-purple-200 text-xs font-bold mb-4">
              <Sparkles className="h-3.5 w-3.5 text-purple-300" />
              Member Benefits
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Save more on every single purchase.
            </h2>

            <p className="mt-2.5 text-sm text-purple-200/90 leading-relaxed">
              {isCashbackEnabled
                ? "Sign in to manage your cashback wallet, access exclusive coupon codes, and withdraw verified savings."
                : "Sign in to save your favorite stores, access exclusive coupon codes, and enjoy verified discounts."}
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3 text-xs sm:text-sm text-purple-100">
                {isCashbackEnabled ? (
                  <>
                    <CircleDollarSign className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Real Bank Cashback:</strong> Earn up to 8.5% cashback on Flipkart, Myntra, Swiggy, and 500+ stores.
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Exclusive Promo Codes:</strong> Access high-value coupon codes on Flipkart, Myntra, Swiggy, and 500+ stores.
                    </span>
                  </>
                )}
              </li>
              <li className="flex items-start gap-3 text-xs sm:text-sm text-purple-100">
                <Tag className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <span>
                  <strong>100% Verified Coupons:</strong> Hand-tested promo codes guaranteed to work at checkout.
                </span>
              </li>
              <li className="flex items-start gap-3 text-xs sm:text-sm text-purple-100">
                <Zap className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Instant Price Drop Alerts:</strong> Get notified when prices crash on your wishlist items.
                </span>
              </li>
            </ul>
          </div>

          <div className="relative z-10 pt-8 mt-8 border-t border-purple-800/40 text-xs text-purple-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              100% Safe &amp; Free Forever
            </span>
            <span>2.5M+ Shoppers</span>
          </div>
        </div>

        {/* Right: Sign In Form Column */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Sign in to your CouponKodee account to continue.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                <span>{error}</span>
              </div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("To reset your password, please contact support@couponkodee.com or use demo sign-in.")}
                    className="text-xs font-semibold text-purple-700 hover:text-purple-900 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-semibold select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fill */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-800 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>Auto-fill Demo Credentials (admin@couponkodee.com)</span>
              </button>
            </div>

            {/* Switch to Sign Up */}
            <div className="mt-6 pt-5 border-t border-slate-200 text-center">
              <p className="text-xs sm:text-sm text-slate-600">
                Don&apos;t have an account yet?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-purple-700 hover:text-purple-900 underline underline-offset-2 ml-1"
                >
                  Join Free &amp; Get ₹50 Bonus &rarr;
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-slate-500">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  )
}
