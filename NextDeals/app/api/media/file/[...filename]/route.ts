import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  try {
    const { filename } = await params
    const rawFilename = filename.join("/")
    const decodedFilename = decodeURIComponent(rawFilename)

    // Check media/ folder in root
    const rootPath = path.resolve(process.cwd(), "media", decodedFilename)
    if (fs.existsSync(rootPath)) {
      const buffer = fs.readFileSync(rootPath)
      const ext = path.extname(rootPath).toLowerCase()
      const contentType = MIME_MAP[ext] || "application/octet-stream"
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      })
    }

    // Also check with unicode apostrophe vs ASCII apostrophe if applicable
    const normalizedName = decodedFilename.replace(/’/g, "'")
    const altPath = path.resolve(process.cwd(), "media", normalizedName)
    if (fs.existsSync(altPath)) {
      const buffer = fs.readFileSync(altPath)
      const ext = path.extname(altPath).toLowerCase()
      const contentType = MIME_MAP[ext] || "application/octet-stream"
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      })
    }

    return new NextResponse("File not found", { status: 404 })
  } catch (err) {
    console.error("Error serving media file:", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
