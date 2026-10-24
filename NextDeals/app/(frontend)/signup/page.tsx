"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import Link from "@/components/localized-link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { BrandLogo } from "@/components/brand-logo"
import { safeRedirectPath } from "@/lib/safe-redirect"
import { localizeHref } from "@/lib/regions"
import { useCountry } from "@/components/country-context"
import { useCashbackVisibility } from "@/components/cashback-context"
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  EyeOff,
  Flame,
  Gift,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Tag,
  User,
  Zap,
} from "lucide-react"

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { region } = useCountry()
  const redirectUrl = localizeHref(safeRedirectPath(searchParams.get("redirect")), region)
  const isCashbackEnabled = useCashbackVisibility()

  const { signup, user } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const successRedirectRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // If already logged in, redirect (in an effect: navigating during render is not allowed)
  useEffect(() => {
    if (user && !isSuccess && !isSubmitting) router.replace(redirectUrl)
  }, [user, isSuccess, isSubmitting, redirectUrl, router])

  useEffect(() => {
    return () => {
      if (successRedirectRef.current) clearTimeout(successRedirectRef.current)
    }
  }, [])

  if (user && !isSuccess && !isSubmitting) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("Please enter your full name.")
      return
    }

    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    if (!agreed) {
      setError("Please accept the Terms of Service to join.")
      return
    }

    setIsSubmitting(true)
    const result = await signup(name, email, password)
    setIsSubmitting(false)

    if (result.success) {
      setIsSuccess(true)
      successRedirectRef.current = setTimeout(() => {
        router.push(redirectUrl)
      }, 1500)
    } else {
      setError(result.error || "Failed to create account. Please try again.")
    }
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
            <BrandLogo tone="light" size="lg" className="mb-8" />

            {/* Welcome Bonus / Member Badge Banner */}
            {isCashbackEnabled ? (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold mb-4">
                <Gift className="h-4 w-4 text-emerald-400" />
                ₹50 Free Welcome Bonus
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-bold mb-4">
                <Sparkles className="h-4 w-4 text-purple-400" />
                100% Free Member Access
              </div>
            )}

            <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
              {isCashbackEnabled
                ? "Start earning real money while shopping."
                : "Start saving money on every single order."}
            </h2>

            <p className="mt-2.5 text-sm text-purple-200/90 leading-relaxed">
              Join free today and never pay full price again on Amazon, Flipkart, Swiggy, Myntra, and 500+ top Indian retailers.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3 text-xs sm:text-sm text-purple-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                {isCashbackEnabled ? (
                  <span>
                    <strong>₹50 Welcome Reward:</strong> Credited straight into your cashback wallet upon joining.
                  </span>
                ) : (
                  <span>
                    <strong>100% Free Forever:</strong> Access thousands of verified coupon codes with zero fees.
                  </span>
                )}
              </li>
              <li className="flex items-start gap-3 text-xs sm:text-sm text-purple-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                {isCashbackEnabled ? (
                  <span>
                    <strong>Direct Bank Transfer:</strong> Transfer confirmed cashback directly to any Indian bank or UPI.
                  </span>
                ) : (
                  <span>
                    <strong>Instant Promo Codes:</strong> 1-click copy codes that drop prices immediately at checkout.
                  </span>
                )}
              </li>
              <li className="flex items-start gap-3 text-xs sm:text-sm text-purple-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Exclusive VIP Coupon Codes:</strong> Special discounts unavailable anywhere else online.
                </span>
              </li>
            </ul>
          </div>

          <div className="relative z-10 pt-8 mt-8 border-t border-purple-800/40 text-xs text-purple-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              No Hidden Fees Ever
            </span>
            <span>Takes 30 Seconds</span>
          </div>
        </div>

        {/* Right: Registration Form Column */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full mb-2">
                <Sparkles className="h-3 w-3 text-emerald-600" />
                Claim ₹50 Welcome Bonus
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Create your free account
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Join 2.5M+ smart shoppers saving millions every month.
              </p>
            </div>

            {/* Success State */}
            {isSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold text-emerald-900">Account Created Successfully!</h3>
                <p className="text-xs font-semibold text-emerald-800">
                  Your ₹50 Welcome Bonus has been credited to your wallet. Redirecting you to the best deals...
                </p>
              </div>
            ) : (
              <>
                {/* Error Message */}
                {error && (
                  <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                    <span>{error}</span>
                  </div>
                )}

                {/* Sign Up Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
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
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Password (min. 6 characters)
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 p-1 text-slate-500 hover:text-slate-600 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 font-semibold select-none leading-relaxed">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 mt-0.5 shrink-0"
                      />
                      <span>
                        I agree to CouponKodee&apos;s{" "}
                        <Link href="/terms" className="text-purple-700 underline underline-offset-2">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-purple-700 underline underline-offset-2">
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span>Creating Account...</span>
                    ) : (
                      <>
                        <Gift className="h-4 w-4 text-emerald-300" />
                        <span>Join Free &amp; Claim ₹50</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Switch to Sign In */}
                <div className="mt-6 pt-5 border-t border-slate-200 text-center">
                  <p className="text-xs sm:text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-bold text-purple-700 hover:text-purple-900 underline underline-offset-2 ml-1"
                    >
                      Sign In &rarr;
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-slate-500">Loading sign up...</div>}>
      <SignUpForm />
    </Suspense>
  )
}
