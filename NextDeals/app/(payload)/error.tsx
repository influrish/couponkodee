'use client'

import React from 'react'

export default function PayloadError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admin Connection Alert | CouponKodee</title>
      </head>
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#090d16', color: '#e2e8f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
        <div style={{ maxWidth: '640px', width: '100%', backgroundColor: '#131c2e', border: '1px solid #1e293b', borderRadius: '1rem', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', backgroundColor: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', color: '#ffffff' }}>
              !
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>Admin Portal Database Notice</h1>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>CouponKodee Edge Diagnostics</p>
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#450a0a', border: '1px solid #991b1b', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#fecaca', lineHeight: '1.5' }}>
            <strong>Unable to reach MongoDB Database:</strong><br />
            {error?.message || 'Database connection timeout. Please verify that your MongoDB Atlas cluster has 0.0.0.0/0 enabled in IP Access List.'}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => reset()}
              style={{ cursor: 'pointer', padding: '0.625rem 1.25rem', backgroundColor: '#7c3aed', color: '#ffffff', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}
            >
              Retry Connection
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- leaves the admin root layout, so a full page load is required */}
            <a
              href="/"
              style={{ padding: '0.625rem 1.25rem', backgroundColor: '#1e293b', color: '#e2e8f0', borderRadius: '0.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600' }}
            >
              Return to Storefront
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
