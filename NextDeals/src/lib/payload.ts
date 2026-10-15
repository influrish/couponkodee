import { getPayload, type Payload } from 'payload'
import payloadConfig from '../payload.config'


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
  const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URI
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required to connect to database')
  }

  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET is required')
  }

  if (cached.client) {
    return cached.client
  }

  if (process.env.ENV === 'dev') {
    // Bypass cache in dev mode
    const freshPayload = await getPayload({
      config: payloadConfig,
      ...(initOptions as any),
    }).then((payload) => {
      console.log('Fresh payload collections:', Object.keys(payload.collections))
      return payload
    })
    return freshPayload

  } else if (!cached.promise) {
    cached.promise = getPayload({
      config: payloadConfig,
      ...(initOptions as any),
    }).then((payload) => {
      console.log('Payload initialized with collections:', Object.keys(payload.collections))
      return payload
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