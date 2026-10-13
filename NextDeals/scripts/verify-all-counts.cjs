async function run() {
  const pages = [
    { name: 'Home', url: 'http://localhost:3000/' },
    { name: 'Stores Directory', url: 'http://localhost:3000/stores' },
    { name: 'Amazon Store Page', url: 'http://localhost:3000/store/amazon' },
    { name: 'Flipkart Store Page', url: 'http://localhost:3000/store/flipkart' },
    { name: 'Ajio Store Page', url: 'http://localhost:3000/store/ajio' },
    { name: 'Savana Store Page', url: 'http://localhost:3000/store/savana' },
    { name: 'Blinkit Store Page', url: 'http://localhost:3000/store/blinkit' },
    { name: 'Fashion Category', url: 'http://localhost:3000/category/fashion' },
    { name: 'Electronics Category', url: 'http://localhost:3000/category/electronics' },
    { name: 'Categories Directory', url: 'http://localhost:3000/categories' },
  ];

  for (const page of pages) {
    try {
      const res = await fetch(page.url);
      const text = await res.text();
      const clean = text.replace(/<!--.*?-->/g, '');
      console.log(`\n=== ${page.name} (${page.url}) - Status: ${res.status} ===`);

      // Extract store-card elements
      const storeCardRegex = /<a[^>]*class="[^"]*store-card[^"]*"[^>]*href="\/store\/([^"]+)"[\s\S]*?<strong[^>]*>([^<]+)<\/strong>[\s\S]*?<small[^>]*>([^<]+)<\/small>/g;
      let match;
      const foundCards = [];
      while ((match = storeCardRegex.exec(clean)) !== null) {
        foundCards.push({ slug: match[1], name: match[2].trim(), countText: match[3].trim() });
      }

      if (foundCards.length > 0) {
        console.log(`Store cards found (${foundCards.length}):`);
        console.table(foundCards.slice(0, 10));
      } else {
        console.log('No store-card matching pattern (or different card layout on this page)');
      }

      // Check general offer counts
      const countsRegex = /(\b\d+\s+(?:active|live)?\s*(?:offers|coupons))/gi;
      const counts = [...clean.matchAll(countsRegex)].map(m => m[0].trim());
      const uniqueCounts = [...new Set(counts)];
      console.log(`Offer count snippets:`, uniqueCounts.slice(0, 8));
    } catch (err) {
      console.error(`Failed to fetch ${page.name}:`, err.message);
    }
  }
}

run();

