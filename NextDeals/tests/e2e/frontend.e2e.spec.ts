import { test, expect } from '@playwright/test'

// Requires a running database with seed data (`pnpm db:local` + `pnpm seed`).
// Test accounts use this domain; tests/int cleans them up.
const TEST_EMAIL_DOMAIN = '@int-test.couponkodee.local'

test.describe('Storefront', () => {
  test('homepage renders with title, header and footer', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/CouponKodee/)
    await expect(page.locator('header').first()).toBeVisible()
    await expect(page.locator('footer').first()).toBeVisible()
  })

  test('header search carries the query into the deals explorer', async ({ page }) => {
    await page.goto('/deals?q=zomato')

    await expect(page.locator('input[type="text"][value="zomato"]').first()).toBeVisible()
  })

  test('unknown URLs show the branded 404 page with a 404 status', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')

    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  })

  test('unknown store slugs land on the filtered store directory', async ({ page }) => {
    await page.goto('/store/best-buy')

    await expect(page).toHaveURL(/\/stores\?q=best(%20|\+)buy/)
  })
})

test.describe('Outbound affiliate links (/out)', () => {
  test('redirects to the merchant with tracking parameters', async ({ request }) => {
    const response = await request.get('/out?url=https%3A%2F%2Fwww.amazon.in%2F&merchant=Amazon&code=SAVE10', {
      maxRedirects: 0,
    })

    expect(response.status()).toBe(307)
    const location = new URL(response.headers()['location'])
    expect(location.hostname).toBe('www.amazon.in')
    expect(location.searchParams.get('utm_campaign')).toBe('amazon_deal')
    expect(location.searchParams.get('coupon')).toBe('SAVE10')
  })

  test('refuses to redirect to hosts that are not known stores', async ({ request }) => {
    const response = await request.get('/out?url=https%3A%2F%2Fevil.example%2F&merchant=amazon', { maxRedirects: 0 })

    expect(response.status()).toBe(307)
    expect(new URL(response.headers()['location']).pathname).toBe('/store/amazon')
  })
})

test.describe('Forms', () => {
  test('contact form submits and confirms', async ({ page }) => {
    await page.goto('/contact')

    await page.getByLabel('Your Name').fill('E2E Tester')
    await page.getByLabel('Email Address').fill(`contact-${Date.now()}${TEST_EMAIL_DOMAIN}`)
    await page.getByLabel('Subject').fill('Automated test')
    await page.getByLabel('Message').fill('This message was sent by the end-to-end test suite.')
    await page.getByRole('button', { name: 'Send Message' }).click()

    await expect(page.getByRole('status')).toContainText('Thanks')
  })

  test('signup ignores off-site redirect targets', async ({ page }) => {
    await page.goto('/signup?redirect=//evil.example')

    await page.getByPlaceholder('e.g. Rahul Sharma').fill('E2E Shopper')
    await page.getByPlaceholder('name@example.com').fill(`signup-${Date.now()}${TEST_EMAIL_DOMAIN}`)
    await page.getByPlaceholder('Create a strong password').fill('e2e-password-123')
    await page.getByRole('button', { name: /Join Free/ }).click()

    // Lands on this site's region home page (e.g. /in), never the off-site target
    await page.waitForURL((url) => /^\/[a-z]+$/.test(url.pathname), { timeout: 15_000 })
    expect(new URL(page.url()).hostname).toBe('localhost')
  })
})
