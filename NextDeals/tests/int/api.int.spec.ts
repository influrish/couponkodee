import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { isDatabaseConfigured } from '../../src/lib/db-config'

// Runs against the database in MONGODB_URI (start one with `pnpm db:local` and `pnpm seed`).
const TEST_EMAIL_DOMAIN = '@int-test.couponkodee.local'

describe.skipIf(!isDatabaseConfigured())('Payload API (integration)', () => {
  let payload: Payload
  let shopper: any
  let otherShopper: any

  const createShopper = (label: string) =>
    payload.create({
      collection: 'users',
      data: {
        name: `Test ${label}`,
        email: `${label}-${Date.now()}${TEST_EMAIL_DOMAIN}`,
        password: 'test-password-123',
        role: 'user',
      },
    })

  beforeAll(async () => {
    const { default: config } = await import('../../src/payload.config')
    payload = await getPayload({ config })
    shopper = await createShopper('shopper')
    otherShopper = await createShopper('other')
  })

  afterAll(async () => {
    // Also removes accounts and messages created by the e2e suite
    for (const collection of ['users', 'contact-messages', 'newsletter-subscribers'] as const) {
      await payload?.delete({ collection, where: { email: { like: TEST_EMAIL_DOMAIN } } })
    }
  })

  it('serves seeded stores to anonymous visitors', async () => {
    const stores = await payload.find({ collection: 'stores', overrideAccess: false, limit: 1 })
    expect(stores.totalDocs).toBeGreaterThan(0)
  })

  it('stops a shopper from promoting themselves to admin', async () => {
    const updated = await payload.update({
      collection: 'users',
      id: shopper.id,
      data: { role: 'admin', name: 'Renamed' },
      user: shopper,
      overrideAccess: false,
    })

    expect(updated.name).toBe('Renamed')
    expect(updated.role).toBe('user')
  })

  it('stops a shopper from editing store content', async () => {
    await expect(
      payload.create({
        collection: 'stores',
        data: { name: 'Fake Store', slug: `fake-${Date.now()}` } as any,
        user: shopper,
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })

  it('stops a shopper from reading other users', async () => {
    const result = await payload.find({ collection: 'users', user: shopper, overrideAccess: false })
    expect(result.docs.map((u) => u.id)).toEqual([shopper.id])

    await expect(
      payload.findByID({ collection: 'users', id: otherShopper.id, user: shopper, overrideAccess: false }),
    ).rejects.toThrow()
  })

  it('stops a shopper from changing site settings', async () => {
    await expect(
      payload.updateGlobal({
        slug: 'site-settings',
        data: { cashbackVisibility: 'on' } as any,
        user: shopper,
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })

  it('keeps contact messages private to staff', async () => {
    await expect(
      payload.find({ collection: 'contact-messages', user: shopper, overrideAccess: false }),
    ).rejects.toThrow()
  })
})
