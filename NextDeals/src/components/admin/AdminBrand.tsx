/**
 * CouponKodee branding for the Payload admin panel (login screen logo and nav icon).
 * Mirrors components/brand-logo.tsx; the admin has its own React tree, so it can't reuse that Link-based component.
 */

function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="ck-admin-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#ck-admin-mark)" />
      <g transform="translate(6.72 6.72) scale(0.773)" fill="none" stroke="#fff" strokeLinecap="round">
        <path d="M18 6 6 18" strokeWidth="2.6" />
        <circle cx="7.5" cy="7.5" r="2.6" strokeWidth="2.2" />
        <circle cx="16.5" cy="16.5" r="2.6" strokeWidth="2.2" />
      </g>
    </svg>
  )
}

export function AdminIcon() {
  return <Mark size={28} />
}

export function AdminLogo() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      <Mark size={44} />
      <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1, whiteSpace: 'nowrap' }}>
        <span style={{ color: 'var(--theme-text)' }}>Coupon</span>
        <span style={{ color: '#7c3aed' }}>Kodee</span>
      </span>
    </span>
  )
}
