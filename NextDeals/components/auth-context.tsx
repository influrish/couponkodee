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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 1. Initial hydration from localStorage and background verification with /api/users/me
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // ignore JSON parse errors
    }

    // Verify session with server
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          const verifiedUser: AuthUser = {
            id: String(data.user.id),
            name: data.user.name || "Member",
            email: data.user.email,
            role: data.user.role || "user",
            walletBalance: 50.0, // Initial welcome bonus
          }
          setUser(verifiedUser)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(verifiedUser))
        } else {
          // If server reports no session, check if we had demo / local stored user
          // Keep local state if user signed in during this session
        }
      })
      .catch(() => {
        // Offline / network fallback
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // 2. Sign In
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await res.json()

      if (!res.ok || !data.user) {
        const errorMsg =
          data.errors?.[0]?.message || data.message || "Invalid email or password. Please try again."
        return { success: false, error: errorMsg }
      }

      const loggedInUser: AuthUser = {
        id: String(data.user.id),
        name: data.user.name || "Member",
        email: data.user.email,
        role: data.user.role || "user",
        walletBalance: 50.0,
      }

      setUser(loggedInUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser))
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Network error. Please check your connection and try again.",
      }
    }
  }, [])

  // 3. Join Free (Sign Up)
  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      })

      const data = await res.json()

      if (!res.ok || !data.user) {
        return { success: false, error: data.error || "Failed to create account. Please try again." }
      }

      const newUser: AuthUser = {
        id: String(data.user.id),
        name: data.user.name,
        email: data.user.email,
        role: data.user.role || "user",
        walletBalance: 50.0,
      }

      setUser(newUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Network error. Please try again.",
      }
    }
  }, [])

  // 4. Log Out
  const logout = useCallback(async () => {
    try {
      await fetch("/api/users/logout", { method: "POST" })
    } catch {
      // ignore network errors on logout
    }
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
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
