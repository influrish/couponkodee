"use client"

import React, { createContext, useContext } from "react"

interface CashbackContextType {
  isCashbackEnabled: boolean
}

const CashbackContext = createContext<CashbackContextType>({
  isCashbackEnabled: false,
})

export function CashbackProvider({
  enabled = false,
  children,
}: {
  enabled?: boolean
  children: React.ReactNode
}) {
  return (
    <CashbackContext.Provider value={{ isCashbackEnabled: Boolean(enabled) }}>
      {children}
    </CashbackContext.Provider>
  )
}

export function useCashbackVisibility(): boolean {
  const context = useContext(CashbackContext)
  return context.isCashbackEnabled
}

