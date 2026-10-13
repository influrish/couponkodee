const http = require('http');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

function extractNumber(str) {
  if (!str) return null;
  const m = str.match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}

async function verify() {
  console.log('====================================================');
  console.log('1. VERIFYING HERO SECTION BACKGROUND');
  console.log('====================================================');

  const home = await fetchPage('http://localhost:3000/');
  const hasShoppingBgInHero = home.data.includes("url('/images/shopping-bg.png')") || home.data.includes("url(\"/images/shopping-bg.png\")");
  const hasGlowOne = home.data.includes("coupon-hero__glow--one");
  const hasGlowTwo = home.data.includes("coupon-hero__glow--two");
  const hasHeading = home.data.includes("Smart Savings");
  const hasSearch = home.data.includes("hero-search");

  console.log('Hero has shopping-bg.png image layer:', hasShoppingBgInHero ? 'FAIL (still present)' : 'PASS (removed)');
  console.log('Hero has glow elements:', (hasGlowOne || hasGlowTwo) ? 'FAIL (still present)' : 'PASS (removed)');
  console.log('Hero has heading content:', hasHeading ? 'PASS (preserved)' : 'FAIL (missing)');
  console.log('Hero has search bar:', hasSearch ? 'PASS (preserved)' : 'FAIL (missing)');

  console.log('\n====================================================');
  console.log('2. VERIFYING OFFER COUNTS ACROSS ALL PAGES');
  console.log('====================================================');

  const storesPage = await fetchPage('http://localhost:3000/stores');
  const couponsPage = await fetchPage('http://localhost:3000/coupons');
  const dealsPage = await fetchPage('http://localhost:3000/deals');

  const testStores = ['amazon', 'tata-1mg', 'flipkart', 'ajio', 'myntra', 'boat', 'dominos', 'acer', 'Savana'];

  let allPassed = true;

  for (const slug of testStores) {
    const storePage = await fetchPage(`http://localhost:3000/store/${slug}`);

    // Extract count from store page
    let storePageCount = null;
    const storePageMatch = storePage.data.match(/(\d+)\s+Live Offers?/i) || storePage.data.match(/>(\d+)<\/dd>/i);
    const summaryMatch = storePage.data.match(/Total Active Offers<\/dt><dd class="[^"]*">(\d+)<\/dd>/i);
    if (summaryMatch) {
      storePageCount = parseInt(summaryMatch[1], 10);
    } else if (storePageMatch) {
      storePageCount = parseInt(storePageMatch[1], 10);
    }

    // Extract count from /stores page
    let storesPageCount = null;
    const storesIdx = storesPage.data.indexOf(`/store/${slug}`);
    if (storesIdx !== -1) {
      const snippet = storesPage.data.substring(storesIdx, storesIdx + 2600);
      const m = snippet.match(/(\d+)\s+active offers?/i);
      if (m) storesPageCount = parseInt(m[1], 10);
    }

    // Extract count from homepage
    let homePageCount = null;
    let homeIdx = 0;
    while ((homeIdx = home.data.indexOf(`/store/${slug}`, homeIdx)) !== -1) {
      const snippet = home.data.substring(homeIdx, homeIdx + 600);
      const m = snippet.match(/(\d+)\s+live offers?/i);
      if (m) {
        homePageCount = parseInt(m[1], 10);
        break;
      }
      homeIdx += 13;
    }

    const matchStores = (storesPageCount === null && storePageCount === 0) || (storesPageCount === storePageCount);
    const matchHome = homePageCount === null || homePageCount === storePageCount;

    const status = (matchStores && matchHome) ? 'MATCH: YES' : 'MISMATCH: NO';
    if (!matchStores || !matchHome) allPassed = false;

    console.log(`Store [${slug.padEnd(10)}]: StorePage = ${storePageCount ?? 'N/A'}, /stores = ${storesPageCount ?? 'N/A'}, Homepage = ${homePageCount ?? 'N/A'} -> ${status}`);
  }

  console.log('\n====================================================');
  console.log('OVERALL VERIFICATION RESULT:', allPassed ? 'ALL TESTS PASSED!' : 'SOME TESTS FAILED');
  console.log('====================================================');
}

verify().catch(console.error);

