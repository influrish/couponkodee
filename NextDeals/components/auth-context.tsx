"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  walletBalance?: number
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
})

const STORAGE_KEY = "couponkodee_user"
// Display-only until a wallet ledger exists on the backend.
const WELCOME_BONUS = 50.0

function toAuthUser(raw: any): AuthUser {
  return {
    id: String(raw.id),
    name: raw.name || "Member",
    email: raw.email,
    role: raw.role || "user",
    walletBalance: WELCOME_BONUS,
  }
}

async function readJson(res: Response): Promise<any> {
  try {
    return await res.json()
  } catch {
    return {} // non-JSON body, e.g. an HTML error page when the server is down
  }
}

function readStoredUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as AuthUser) : null
  } catch {
    return null
  }
}

function writeStoredUser(user: AuthUser | null) {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // storage unavailable (private mode / quota); in-memory state still works
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 1. Initial hydration from localStorage, then verify the session cookie with /api/users/me
  useEffect(() => {
    let cancelled = false
    setUser(readStoredUser())

    fetch("/api/users/me", { credentials: "same-origin" })
      .then(async (res) => {
        if (!res.ok) return // server/DB unavailable: keep the cached user until we know better
        const data = await res.json()
        if (cancelled) return
        // The server is authoritative: no user means the cookie expired or was cleared.
        const verifiedUser = data.user ? toAuthUser(data.user) : null
        setUser(verifiedUser)
        writeStoredUser(verifiedUser)
      })
      .catch(() => {
        // Offline: keep cached state
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // 2. Keep tabs in sync when the user logs in or out elsewhere
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) setUser(readStoredUser())
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  // 3. Sign In
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await readJson(res)

      if (!res.ok || !data.user) {
        const errorMsg =
          data.errors?.[0]?.message ||
          data.message ||
          (res.status >= 500 ? "Sign-in is temporarily unavailable. Please try again shortly." : "Invalid email or password. Please try again.")
        return { success: false, error: errorMsg }
      }

      const loggedInUser = toAuthUser(data.user)
      setUser(loggedInUser)
      writeStoredUser(loggedInUser)
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Network error. Please check your connection and try again.",
      }
    }
  }, [])

  // 4. Join Free (Sign Up)
  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      })

      const data = await readJson(res)

      if (!res.ok || !data.user) {
        return { success: false, error: data.error || "Failed to create account. Please try again." }
      }

      const newUser = toAuthUser(data.user)
      setUser(newUser)
      writeStoredUser(newUser)
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Network error. Please try again.",
      }
    }
  }, [])

  // 5. Log Out
  const logout = useCallback(async () => {
    try {
      await fetch("/api/users/logout", { method: "POST" })
    } catch {
      // ignore network errors on logout
    }
    setUser(null)
    writeStoredUser(null)
    router.refresh()
  }, [router])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
