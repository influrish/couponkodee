import { NextResponse } from "next/server"
import { getCashbackVisibility } from "@/lib/cms-settings"

export const dynamic = "force-dynamic"

export async function GET() {
  const isCashbackEnabled = await getCashbackVisibility()
  return NextResponse.json({
    cashbackVisibility: isCashbackEnabled ? "on" : "off",
    isCashbackEnabled,
  })
}

