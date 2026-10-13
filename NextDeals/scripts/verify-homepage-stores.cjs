const http = require('http');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function checkAllHomepageStores() {
  const homeData = await fetchPage('http://localhost:3000/');
  const storesSecIdx = homeData.indexOf('id="stores"');
  const storesSec = homeData.substring(storesSecIdx, storesSecIdx + 12000);

  // Match each store-card link
  const cardRegex = /<a class="store-card group" href="\/store\/([^"]+)"[\s\S]*?<strong[^>]*>([^<]+)<\/strong>[\s\S]*?<small[^>]*>([\s\S]*?)<\/small>/g;
  let match;
  let count = 0;
  let allMatched = true;

  console.log('----------------------------------------------------');
  console.log('CHECKING ALL POPULAR STORES ON HOMEPAGE:');
  console.log('----------------------------------------------------');

  while ((match = cardRegex.exec(storesSec)) !== null) {
    count++;
    const slug = match[1];
    const name = match[2];
    const smallText = match[3];
    const numMatch = smallText.match(/(\d+)/);
    const homeCount = numMatch ? parseInt(numMatch[1], 10) : null;

    const storeData = await fetchPage(`http://localhost:3000/store/${slug}`);
    const summaryMatch = storeData.match(/Total Active Offers<\/dt><dd class="[^"]*">(\d+)<\/dd>/i);
    const storeCount = summaryMatch ? parseInt(summaryMatch[1], 10) : null;

    const isMatch = homeCount === storeCount;
    if (!isMatch) allMatched = false;

    console.log(`[${count}] ${name.padEnd(15)} (slug: ${slug.padEnd(12)}): Homepage = ${homeCount}, /store/${slug} = ${storeCount} -> ${isMatch ? 'MATCH: YES' : 'MISMATCH: NO'}`);
  }

  console.log('----------------------------------------------------');
  console.log(`Verified ${count} stores on homepage. All matched: ${allMatched}`);
  console.log('----------------------------------------------------');
}

checkAllHomepageStores().catch(console.error);

