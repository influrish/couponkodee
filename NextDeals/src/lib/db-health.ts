import { MongoClient } from 'mongodb'
import { getDatabaseUri, isDatabaseConfigured } from './db-config'

/**
 * Payload's MongoDB adapter calls process.exit(1) when its first connection
 * fails, which takes the whole server down. Every entry point that may
 * initialize Payload checks reachability here first.
 */

const OK_TTL_MS = 30_000
const FAILURE_TTL_MS = 15_000
const PING_TIMEOUT_MS = 3_000

interface HealthState {
  lastOkAt: number
  lastFailureAt: number
  lastFailureReason: DbFailureReason | null
  inflight: Promise<boolean> | null
}

/** Safe, credential-free category of why the database can't be reached. */
export type DbFailureReason = 'not-configured' | 'auth' | 'network' | 'dns' | 'tls' | 'unknown'

export function classifyDbError(err: unknown): DbFailureReason {
  const text = `${(err as Error)?.name ?? ''} ${(err as Error)?.message ?? ''}`.toLowerCase()
  if (/auth|bad auth|authentication failed|unauthorized/.test(text)) return 'auth'
  if (/querysrv|enotfound|dns|getaddrinfo|resolve/.test(text)) return 'dns'
  if (/ssl|tls|certificate|handshake/.test(text)) return 'tls'
  if (/timed out|timeout|econnrefused|serverselection|whitelist|ip/.test(text)) return 'network'
  return 'unknown'
}

// Kept on globalThis so all route bundles share one state.
const state: HealthState = ((globalThis as any).__couponkodeeDbHealth ??= {
  lastOkAt: 0,
  lastFailureAt: 0,
  lastFailureReason: null,
  inflight: null,
})

async function ping(): Promise<boolean> {
  const client = new MongoClient(getDatabaseUri(), {
    serverSelectionTimeoutMS: PING_TIMEOUT_MS,
    connectTimeoutMS: PING_TIMEOUT_MS,
  })
  try {
    await client.connect()
    await client.db().command({ ping: 1 })
    state.lastOkAt = Date.now()
    return true
  } catch (err) {
    state.lastFailureAt = Date.now()
    state.lastFailureReason = classifyDbError(err)
    console.warn('MongoDB is unreachable; serving fallbacks:', (err as Error)?.message || err)
    return false
  } finally {
    await client.close().catch(() => undefined)
  }
}

export function getLastDbFailureReason(): DbFailureReason | null {
  return state.lastFailureReason
}

export async function isDatabaseReachable(): Promise<boolean> {
  if (!isDatabaseConfigured()) return false

  const now = Date.now()
  if (now - state.lastOkAt < OK_TTL_MS) return true
  if (now - state.lastFailureAt < FAILURE_TTL_MS) return false

  state.inflight ??= ping().finally(() => {
    state.inflight = null
  })
  return state.inflight
}
