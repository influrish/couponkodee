import { getPayload, type Payload } from 'payload'
import payloadConfig from '../payload.config'
import { isDatabaseConfigured } from './db-config'
import { isDatabaseReachable } from './db-health'

const MONGOOSE_CONNECTED = 1

declare global {
  var payload: {
    client: Payload | null
    promise: Promise<Payload> | null
  }
}

let cached = global.payload

if (!cached) {
  cached = global.payload = { client: null, promise: null }
}

type InitOptions = Parameters<typeof getPayload>[0]

export const getPayloadClient = async (initOptions?: Partial<InitOptions>): Promise<Payload> => {
  if (!isDatabaseConfigured()) {
    throw new Error('MONGODB_URI is missing or invalid; set it in .env.local (see .env.example)')
  }

  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET is required')
  }

  if (cached.client) {
    // Mongoose reconnects in the background; until it does, fail fast so callers
    // use their fallbacks instead of waiting out the server-selection timeout per query.
    const readyState = (cached.client.db as { connection?: { readyState?: number } }).connection?.readyState
    if (readyState !== undefined && readyState !== MONGOOSE_CONNECTED) {
      throw new Error('Database connection lost; reconnecting in the background')
    }
    return cached.client
  }

  // Payload exits the process if its first connection fails, so check first.
  if (!cached.promise && !(await isDatabaseReachable())) {
    throw new Error('Database is unreachable; retrying shortly')
  }

  if (!cached.promise) {
    cached.promise = getPayload({
      config: payloadConfig,
      ...(initOptions as any),
    })
  }

  try {
    cached.client = await cached.promise
  } catch (e: unknown) {
    cached.promise = null
    throw e
  }

  return cached.client
}
