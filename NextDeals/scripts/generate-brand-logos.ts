import fs from "fs"
import path from "path"

const LOGOS_DIR = path.resolve(process.cwd(), "public/logos")

if (!fs.existsSync(LOGOS_DIR)) {
  fs.mkdirSync(LOGOS_DIR, { recursive: true })
}

const logos: Record<string, string> = {
  // 1. Amazon
  amazon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#FFFFFF"/>
  <rect width="198" height="198" x="1" y="1" rx="35" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(18, 55)">
    <!-- amazon text -->
    <path fill="#232F3E" d="M38.5 45.2c-5.8 4.2-11.2 5.8-17.2 5.8-10.2 0-16.5-6.5-16.5-16.8 0-13.2 10.5-19.5 24.5-19.5 3.2 0 6.2.3 9.2.9v-2.2c0-5.8-3.8-9-11.8-9-5.8 0-11.8 1.8-16.8 4.8l-2.8-6.2c6.2-3.8 13.8-5.8 21.8-5.8 13.8 0 20.8 6.8 20.8 18.8v28.5h-11.2v-9.3zm0-13.8c-2.8-.8-6.5-1.2-9.8-1.2-8.5 0-13.8 3.5-13.8 11.2 0 6.2 3.8 9.5 9.8 9.5 4.8 0 9.8-2 13.8-5.8v-13.7zm28.8-23.2h10.8v7.8c3.5-5.5 9.2-8.8 15.8-8.8 6.5 0 11.8 2.8 14.5 8.2 4.2-5.5 10.5-8.2 17.5-8.2 9.8 0 16.5 6.5 16.5 18.5v28.8h-11.2V32.5c0-6.8-3-10-8.5-10-4.8 0-9.2 3.2-11.5 8.2v23.8h-11.2V32.5c0-6.8-3-10-8.5-10-4.8 0-9.2 3.2-11.5 8.2v23.8H67.3V8.2zm85.8 22.8c0-14.5 10.8-23.8 25.2-23.8s25.2 9.2 25.2 23.8c0 14.5-10.8 23.8-25.2 23.8s-25.2-9.2-25.2-23.8zm38.8 0c0-9.2-5.8-15.5-13.5-15.5s-13.5 6.2-13.5 15.5 5.8 15.5 13.5 15.5 13.5-6.2 13.5-15.5z"/>
    <!-- Orange Smile Arrow -->
    <path fill="#FF9900" d="M12.5 65.5C45.2 88.5 110.5 91.2 152.2 64.2c2.2-1.5 4.5.8 2.8 2.8-24.5 28.5-88.5 35.2-140.2 2.2-1.8-1.2-.2-3.8 2.2-3.8z"/>
    <path fill="#FF9900" d="M158.8 60.5c-3.8-4.5-10.2-6.5-17.5-5.2-1.2.2-1.5 1.8-.2 2.5 5.8 3.5 12.8 8.8 15.2 14.8.8 1.8 2.5 1.5 3.2-.2 2.2-5.5 5.8-10.2 8.5-13.2 1-.8.2-2.5-1-2.2-3 1.2-6.2 2.5-8.2 3.5z"/>
  </g>
</svg>`,

  // 2. Flipkart
  flipkart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#2874F0"/>
  <g transform="translate(42, 28)">
    <!-- Yellow Shopping Bag -->
    <path fill="#FFE11B" d="M22 42h72c3 0 5 3 4.5 6l-11 75c-.8 5-5 8.5-10 8.5H38c-5 0-9.2-3.5-10-8.5l-10.5-75c-.5-3 1.5-6 4.5-6z"/>
    <!-- Bag Handle -->
    <path fill="none" stroke="#FFE11B" stroke-width="7" stroke-linecap="round" d="M42 42V28c0-8.8 7.2-16 16-16s16 7.2 16 16v14"/>
    <!-- Flipkart F with Speed Lines -->
    <path fill="#2874F0" d="M48 62h26c2 0 3.5 1.5 3.5 3.5v7c0 2-1.5 3.5-3.5 3.5H58v10h12c2 0 3.5 1.5 3.5 3.5v6c0 2-1.5 3.5-3.5 3.5H58v22c0 2-1.5 3.5-3.5 3.5h-4c-2 0-3.5-1.5-3.5-3.5V65.5c0-2 1.5-3.5 3.5-3.5h-2.5z"/>
    <!-- Speed Lines on Bag -->
    <path fill="#FFFFFF" d="M32 76h10v4H32zm-6 12h12v4H26zm4 12h8v4h-8z"/>
  </g>
  <text x="100" y="172" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-style="italic" font-size="22" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">Flipkart</text>
</svg>`,

  // 3. Myntra
  myntra: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#FFFFFF"/>
  <rect width="198" height="198" x="1" y="1" rx="35" fill="none" stroke="#F1F5F9" stroke-width="2"/>
  <g transform="translate(32, 42)">
    <!-- Left loop -->
    <path fill="#FF3F6C" d="M22 84c-12 0-22-10-22-22V32c0-12 10-22 22-22s22 10 22 22v30c0 12-10 22-22 22z"/>
    <!-- Overlapping center-left orange -->
    <path fill="#FF527B" opacity="0.9" d="M44 84c-12 0-22-10-22-22V32c0-12 10-22 22-22s22 10 22 22v30c0 12-10 22-22 22z"/>
    <!-- Center right yellow-orange -->
    <path fill="#FCA120" d="M92 84c-12 0-22-10-22-22V32c0-12 10-22 22-22s22 10 22 22v30c0 12-10 22-22 22z"/>
    <!-- Far right orange-red -->
    <path fill="#FC6020" opacity="0.9" d="M114 84c-12 0-22-10-22-22V32c0-12 10-22 22-22s22 10 22 22v30c0 12-10 22-22 22z"/>
  </g>
  <text x="100" y="165" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="20" fill="#282C3F" text-anchor="middle" letter-spacing="2">Myntra</text>
</svg>`,

  // 4. Swiggy
  swiggy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#FC8019"/>
  <g transform="translate(62, 32)">
    <!-- Stylized Swiggy Map Pin 'S' Logo -->
    <path fill="#FFFFFF" d="M38 0C17 0 0 17 0 38c0 24 33 62 35 64.5 1.5 1.8 4.5 1.8 6 0C43 100 76 62 76 38 76 17 59 0 38 0zm-2 22c8.8 0 16 7.2 16 16 0 5-2.2 9.5-5.8 12.5L34 62c-1.5 1.5-4 1.5-5.5 0l-5-5c-3-3-4.5-7-4.5-11 0-8.8 7.2-16 16-16z"/>
    <!-- Swiggy Inner Curve -->
    <path fill="#FC8019" d="M38 27c-6.1 0-11 4.9-11 11 0 3.2 1.4 6.1 3.6 8.1l4.8 4.8c1.5 1.5 4 1.5 5.5 0l8.1-8.1C51.6 40.8 53 38 53 35c0-4.4-3.6-8-8-8h-7z"/>
  </g>
  <text x="100" y="166" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">SWIGGY</text>
</svg>`,

  // 5. Zomato
  zomato: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#E23744"/>
  <g transform="translate(25, 62)">
    <text x="75" y="58" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-style="italic" font-size="44" fill="#FFFFFF" text-anchor="middle" letter-spacing="-1">zomato</text>
  </g>
</svg>`,

  // 6. Ajio
  ajio: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#1C1C1E"/>
  <g transform="translate(25, 70)">
    <text x="75" y="48" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="46" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">AJIO</text>
  </g>
  <circle cx="100" cy="142" r="5" fill="#3B82F6"/>
</svg>`,

  // 7. Nykaa
  nykaa: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#FC2779"/>
  <g transform="translate(20, 68)">
    <text x="80" y="50" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="38" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">NYKAA</text>
    <polygon points="145,15 148,25 158,28 148,31 145,41 142,31 132,28 142,25" fill="#FFE11B"/>
  </g>
</svg>`,

  // 8. Tata 1mg
  "tata-1mg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#FFFFFF"/>
  <rect width="198" height="198" x="1" y="1" rx="35" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(30, 36)">
    <!-- Pill Symbol -->
    <rect x="50" y="8" width="40" height="74" rx="20" fill="#FF6F61" transform="rotate(45 70 45)"/>
    <path d="M42 42 L98 42" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
    <path fill="#2B3954" d="M70 18 C85 33 85 57 70 72 L52 54 C40 42 45 25 55 18 Z" opacity="0.25"/>
  </g>
  <text x="100" y="148" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="14" fill="#0D3B66" text-anchor="middle" letter-spacing="3">TATA</text>
  <text x="100" y="174" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="24" fill="#FF6F61" text-anchor="middle" letter-spacing="1">1mg</text>
</svg>`,

  // 9. boAt
  boat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#E31E24"/>
  <g transform="translate(50, 32)">
    <!-- Origami Sailboat Icon -->
    <polygon points="50,15 50,75 88,75" fill="#FFFFFF"/>
    <polygon points="44,28 44,75 12,75" fill="#FFFFFF" opacity="0.8"/>
    <polygon points="12,82 88,82 72,96 28,96" fill="#FFFFFF"/>
  </g>
  <text x="100" y="162" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">boAt</text>
</svg>`,

  // 10. Blinkit
  blinkit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#F8CB46"/>
  <g transform="translate(20, 60)">
    <text x="80" y="55" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="36" fill="#0C831F" text-anchor="middle" letter-spacing="-0.5">blinkit</text>
    <circle cx="148" cy="28" r="6" fill="#E23744"/>
  </g>
</svg>`,

  // 11. Domino's
  dominos: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#006491"/>
  <g transform="translate(52, 28) rotate(45 50 50)">
    <!-- Blue tile with 1 dot -->
    <rect x="15" y="15" width="70" height="34" rx="6" fill="#006491" stroke="#FFFFFF" stroke-width="4"/>
    <circle cx="50" cy="32" r="6" fill="#FFFFFF"/>
    <!-- Red tile with 2 dots -->
    <rect x="15" y="51" width="70" height="34" rx="6" fill="#E31837" stroke="#FFFFFF" stroke-width="4"/>
    <circle cx="34" cy="68" r="6" fill="#FFFFFF"/>
    <circle cx="66" cy="68" r="6" fill="#FFFFFF"/>
  </g>
  <text x="100" y="172" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">Domino's</text>
</svg>`,

  // 12. MakeMyTrip
  makemytrip: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#FFFFFF"/>
  <rect width="198" height="198" x="1" y="1" rx="35" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(50, 32)">
    <circle cx="50" cy="50" r="46" fill="#E41D24"/>
    <text x="50" y="60" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle">my</text>
  </g>
  <text x="100" y="162" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" fill="#0D3E75" text-anchor="middle" letter-spacing="1">makemytrip</text>
</svg>`,

  // 13. Samsung
  samsung: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#1428A0"/>
  <g transform="translate(18, 52)">
    <ellipse cx="82" cy="48" rx="80" ry="38" fill="none" stroke="#FFFFFF" stroke-width="4" transform="rotate(-12 82 48)"/>
    <text x="82" y="56" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">SAMSUNG</text>
  </g>
</svg>`,

  // 14. Croma
  croma: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#121212"/>
  <g transform="translate(20, 70)">
    <text x="80" y="46" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="36" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">croma</text>
    <circle cx="148" cy="22" r="7" fill="#00A896"/>
  </g>
</svg>`,

  // 15. Cleartrip
  cleartrip: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#FFFFFF"/>
  <rect width="198" height="198" x="1" y="1" rx="35" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(50, 30)">
    <!-- Plane icon -->
    <path fill="#F37021" d="M12 48 L76 12 L84 24 L48 56 L82 72 L78 82 L34 62 L20 86 L8 82 L16 54 Z"/>
  </g>
  <text x="100" y="156" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="22" fill="#333333" text-anchor="middle" letter-spacing="1">cleartrip</text>
</svg>`,

  // 16. Dell
  dell: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#FFFFFF"/>
  <rect width="198" height="198" x="1" y="1" rx="35" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <circle cx="100" cy="100" r="74" fill="none" stroke="#0076CE" stroke-width="8"/>
  <g transform="translate(42, 75)">
    <text x="58" y="36" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="#0076CE" text-anchor="middle" letter-spacing="3">DELL</text>
  </g>
</svg>`,

  // 17. HP
  hp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#0096D6"/>
  <circle cx="100" cy="100" r="72" fill="#0096D6"/>
  <g transform="translate(58, 48) skewX(-20)">
    <!-- HP signature stripes -->
    <rect x="14" y="12" width="10" height="78" fill="#FFFFFF" rx="4"/>
    <rect x="32" y="32" width="10" height="58" fill="#FFFFFF" rx="4"/>
    <rect x="22" y="44" width="20" height="10" fill="#FFFFFF"/>
    <rect x="52" y="32" width="10" height="76" fill="#FFFFFF" rx="4"/>
    <rect x="68" y="32" width="10" height="42" fill="#FFFFFF" rx="4"/>
    <rect x="58" y="32" width="20" height="10" fill="#FFFFFF"/>
    <rect x="58" y="64" width="20" height="10" fill="#FFFFFF"/>
  </g>
</svg>`,

  // 18. Acer
  acer: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#FFFFFF"/>
  <rect width="198" height="198" x="1" y="1" rx="35" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(25, 75)">
    <text x="75" y="42" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="46" fill="#83B81A" text-anchor="middle" letter-spacing="-1">acer</text>
  </g>
</svg>`,

  // 19. H&M
  hm: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#FFFFFF"/>
  <rect width="198" height="198" x="1" y="1" rx="35" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(25, 62)">
    <text x="75" y="58" font-family="Georgia, serif" font-weight="900" font-style="italic" font-size="64" fill="#CD1C24" text-anchor="middle" letter-spacing="1">H&amp;M</text>
  </g>
</svg>`,

  // 20. IKEA
  ikea: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#0051BA"/>
  <ellipse cx="100" cy="100" rx="84" ry="58" fill="#FFDA1A"/>
  <text x="100" y="116" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="42" fill="#0051BA" text-anchor="middle" letter-spacing="3">IKEA</text>
</svg>`,

  // 21. JioMart
  jiomart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#0F3E99"/>
  <g transform="translate(55, 30)">
    <circle cx="45" cy="45" r="40" fill="#E23744"/>
    <text x="45" y="58" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle">Jio</text>
  </g>
  <text x="100" y="162" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="24" fill="#00D26A" text-anchor="middle" letter-spacing="1">Mart</text>
</svg>`,

  // 22. KFC
  kfc: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#A3080C"/>
  <g transform="translate(30, 24)">
    <rect x="25" y="10" width="18" height="90" fill="#FFFFFF"/>
    <rect x="55" y="10" width="18" height="90" fill="#FFFFFF"/>
    <rect x="85" y="10" width="18" height="90" fill="#FFFFFF"/>
  </g>
  <rect x="25" y="125" width="150" height="48" rx="8" fill="#FFFFFF"/>
  <text x="100" y="160" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="36" fill="#A3080C" text-anchor="middle" letter-spacing="3">KFC</text>
</svg>`,

  // 23. Lenskart
  lenskart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#000042"/>
  <g transform="translate(35, 42)">
    <!-- Spectacles Icon -->
    <circle cx="34" cy="45" r="28" fill="none" stroke="#00BAC6" stroke-width="7"/>
    <circle cx="96" cy="45" r="28" fill="none" stroke="#00BAC6" stroke-width="7"/>
    <path d="M62 45 L68 45" stroke="#00BAC6" stroke-width="7" stroke-linecap="round"/>
    <path d="M6 45 L6 36" stroke="#00BAC6" stroke-width="7" stroke-linecap="round"/>
    <path d="M124 45 L124 36" stroke="#00BAC6" stroke-width="7" stroke-linecap="round"/>
  </g>
  <text x="100" y="156" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">lenskart</text>
</svg>`,

  // 24. Netmeds
  netmeds: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#FFFFFF"/>
  <rect width="198" height="198" x="1" y="1" rx="35" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(60, 30)">
    <circle cx="40" cy="40" r="38" fill="#24AEB1"/>
    <!-- Medical Cross -->
    <rect x="34" y="20" width="12" height="40" rx="3" fill="#FFFFFF"/>
    <rect x="20" y="34" width="40" height="12" rx="3" fill="#FFFFFF"/>
  </g>
  <text x="100" y="156" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="22" fill="#24AEB1" text-anchor="middle" letter-spacing="1">Netmeds</text>
</svg>`,

  // 25. Pepperfry
  pepperfry: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#FFFFFF"/>
  <rect width="198" height="198" x="1" y="1" rx="35" fill="none" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(50, 30)">
    <!-- Chair / Furniture Symbol -->
    <path fill="#FF671F" d="M30 20 L70 20 C75 20 80 25 80 30 L80 55 L20 55 L20 30 C20 25 25 20 30 20 Z"/>
    <rect x="18" y="55" width="64" height="10" rx="3" fill="#FF671F"/>
    <rect x="24" y="65" width="8" height="28" fill="#FF671F"/>
    <rect x="68" y="65" width="8" height="28" fill="#FF671F"/>
  </g>
  <text x="100" y="158" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="22" fill="#FF671F" text-anchor="middle" letter-spacing="1">pepperfry</text>
</svg>`,

  // 26. Puma
  puma: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#111111"/>
  <g transform="translate(36, 40)">
    <!-- Leaping Puma Silhouette -->
    <path fill="#FFFFFF" d="M112 18c-3-2-7-3-11-2l-18 6c-3 1-8 2-12 1-7-2-12-8-14-15-1-4-4-7-8-7-4 0-7 3-8 7-2 8-8 14-16 16-4 1-8 0-11-1L16 18c-4-1-8 0-11 2-4 3-5 8-3 12l8 18c4 9 12 16 22 18l24 5c5 1 9 4 12 8l10 14c3 4 8 6 13 6 6 0 11-3 14-8l12-22c3-6 9-10 16-12l10-3c5-1 8-6 7-11-1-5-6-9-11-7z"/>
  </g>
  <text x="100" y="160" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">PUMA</text>
</svg>`,

  // 27. Tata CLiQ
  "tata-cliq": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#1F1F1F"/>
  <text x="100" y="65" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">TATA</text>
  <g transform="translate(35, 78)">
    <text x="52" y="45" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">CLi</text>
    <!-- Magenta looped Q -->
    <circle cx="106" cy="28" r="18" fill="none" stroke="#FF007A" stroke-width="7"/>
    <path d="M116 38 L126 50" stroke="#FF007A" stroke-width="7" stroke-linecap="round"/>
  </g>
</svg>`,

  // 28. Urban Company
  "urban-company": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#000000"/>
  <g transform="translate(48, 38)">
    <!-- UC Monogram Box -->
    <rect x="0" y="0" width="104" height="68" rx="16" fill="#FD7014"/>
    <text x="52" y="52" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="44" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">UC</text>
  </g>
  <text x="100" y="152" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="14" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">URBAN</text>
  <text x="100" y="172" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="14" fill="#FD7014" text-anchor="middle" letter-spacing="2">COMPANY</text>
</svg>`,

  // 29. Zepto
  zepto: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#5B21B6"/>
  <g transform="translate(60, 24)">
    <!-- Speed Lightning Bolt -->
    <polygon points="46,10 16,58 38,58 30,96 66,46 44,46" fill="#FF007A"/>
    <polygon points="42,16 22,54 36,54 32,82 56,48 40,48" fill="#FACC15"/>
  </g>
  <text x="100" y="165" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="32" fill="#FFFFFF" text-anchor="middle" letter-spacing="-1">zepto</text>
</svg>`,

  // 30. 2GUD
  "2gud": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#0288D1"/>
  <g transform="translate(30, 45)">
    <circle cx="70" cy="40" r="38" fill="none" stroke="#FFFFFF" stroke-width="6"/>
    <!-- Tech gear / thumbs up tick -->
    <path d="M54 40 L65 52 L88 28" stroke="#FFE11B" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="100" y="156" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="30" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">2GUD</text>
</svg>`,

  // 31. Ferns N Petals
  "ferns-n-petals": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <rect width="200" height="200" rx="36" fill="#1E4D2B"/>
  <g transform="translate(60, 28)">
    <!-- Floral Petals Emblem -->
    <circle cx="40" cy="40" r="14" fill="#D4AF37"/>
    <ellipse cx="40" cy="18" rx="8" ry="16" fill="#E8C359"/>
    <ellipse cx="40" cy="62" rx="8" ry="16" fill="#E8C359"/>
    <ellipse cx="18" cy="40" rx="16" ry="8" fill="#E8C359"/>
    <ellipse cx="62" cy="40" rx="16" ry="8" fill="#E8C359"/>
  </g>
  <text x="100" y="148" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">fnp</text>
  <text x="100" y="174" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="12" fill="#D4AF37" text-anchor="middle" letter-spacing="1">FERNS N PETALS</text>
</svg>`,
}

console.log("Generating brand logos in public/logos/...")
let count = 0
for (const [slug, svg] of Object.entries(logos)) {
  const filePath = path.join(LOGOS_DIR, `${slug}.svg`)
  fs.writeFileSync(filePath, svg.trim(), "utf-8")
  count++
}

console.log(`✅ Successfully generated ${count} vector brand logos in public/logos/!`)
