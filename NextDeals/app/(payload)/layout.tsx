/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

export const dynamic = 'force-dynamic'

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

export default async function PayloadLayout({ children }: { children: React.ReactNode }) {
  const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URI || ''
  const isInvalidMongo =
    !mongoUri ||
    mongoUri.includes('127.0.0.1') ||
    mongoUri.includes('localhost') ||
    mongoUri.includes('<username>') ||
    mongoUri.includes('...')

  if (isInvalidMongo) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Admin Portal Setup | CouponKodee</title>
        </head>
        <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#090d16', color: '#e2e8f0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ maxWidth: '640px', width: '100%', backgroundColor: '#131c2e', border: '1px solid #1e293b', borderRadius: '1rem', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', backgroundColor: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', color: '#ffffff' }}>
                CK
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>CouponKodee Admin Portal</h1>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>Cloudflare Edge &amp; Payload CMS Configuration</p>
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#451a03', border: '1px solid #78350f', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>⚙️</span>
              <div style={{ fontSize: '0.875rem', lineHeight: '1.4', color: '#fde68a' }}>
                <strong>MongoDB Atlas Database Required:</strong><br />
                The public storefront is 100% active using static fallbacks. To activate the live <strong>/admin</strong> dashboard on Cloudflare Workers, a remote MongoDB Atlas database connection string is required.
              </div>
            </div>

            <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#f1f5f9', marginBottom: '0.75rem' }}>Quick Setup Instructions:</h2>
            <ol style={{ paddingLeft: '1.25rem', margin: '0 0 1.5rem 0', fontSize: '0.875rem', lineHeight: '1.7', color: '#cbd5e1' }}>
              <li>
                Create a free MongoDB database on <a href="https://www.mongodb.com/atlas" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>MongoDB Atlas</a>.
              </li>
              <li>
                In <strong>Network Access</strong>, add <code style={{ backgroundColor: '#1e293b', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', color: '#38bdf8' }}>0.0.0.0/0</code> (Allow Access from Anywhere) so Cloudflare edge data centers can connect.
              </li>
              <li>
                In your <strong>Cloudflare Dashboard</strong> (<code style={{ backgroundColor: '#1e293b', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', color: '#38bdf8' }}>Workers &amp; Pages &gt; couponkodee &gt; Settings &gt; Variables and Secrets</code>):
                <ul style={{ marginTop: '0.25rem' }}>
                  <li>Add encrypted secret <strong>MONGODB_URI</strong>: <code style={{ backgroundColor: '#1e293b', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', color: '#fcd34d', wordBreak: 'break-all' }}>mongodb+srv://&lt;user&gt;:&lt;password&gt;@cluster0.xxx.mongodb.net/couponkodee?retryWrites=true&amp;w=majority</code></li>
                  <li>Add encrypted secret <strong>PAYLOAD_SECRET</strong>: (random 32+ character key)</li>
                </ul>
              </li>
              <li>Trigger a redeployment or push to GitHub to activate the Admin Panel.</li>
            </ol>

            <div style={{ padding: '1rem', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem' }}>DEFAULT ADMIN CREDENTIALS:</div>
              <div style={{ fontSize: '0.875rem', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div><strong>Email / ID:</strong> <code style={{ color: '#38bdf8' }}>admin@couponkodee.com</code></div>
                <div><strong>Password:</strong> <code style={{ color: '#38bdf8' }}>admin123</code></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="/" style={{ padding: '0.625rem 1.25rem', backgroundColor: '#0284c7', color: '#ffffff', borderRadius: '0.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600' }}>
                Return to Storefront
              </a>
              <a href="/stores" style={{ padding: '0.625rem 1.25rem', backgroundColor: '#1e293b', color: '#e2e8f0', borderRadius: '0.5rem', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600' }}>
                View Stores
              </a>
            </div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}

