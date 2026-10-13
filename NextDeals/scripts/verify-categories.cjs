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

async function checkCategoryPage(catSlug) {
  const html = await fetchPage(`http://localhost:3000/category/${catSlug}`);
  const cardRegex = /href="\/store\/([^"]+)"[\s\S]*?<strong[^>]*>([^<]+)<\/strong>[\s\S]*?<span[^>]*class="text-xs font-semibold text-slate-500 block"[^>]*>([\s\S]*?)<\/span>/g;
  let match;
  let allMatched = true;

  console.log(`\nCHECKING /category/${catSlug}:`);
  while ((match = cardRegex.exec(html)) !== null) {
    const slug = match[1];
    const name = match[2];
    const num = match[3].match(/(\d+)/);
    const catCount = num ? parseInt(num[1], 10) : null;

    const storeData = await fetchPage(`http://localhost:3000/store/${slug}`);
    const summaryMatch = storeData.match(/Total Active Offers<\/dt><dd class="[^"]*">(\d+)<\/dd>/i);
    const storeCount = summaryMatch ? parseInt(summaryMatch[1], 10) : null;

    const isMatch = catCount === storeCount;
    if (!isMatch) allMatched = false;

    console.log(`  ${name.padEnd(16)} (slug: ${slug.padEnd(12)}): Category = ${catCount}, /store/${slug} = ${storeCount} -> ${isMatch ? 'MATCH: YES' : 'MISMATCH: NO'}`);
  }
  return allMatched;
}

async function run() {
  const r1 = await checkCategoryPage('beauty');
  const r2 = await checkCategoryPage('electronics');
  const r3 = await checkCategoryPage('fashion');
  console.log('\nAll category tests passed:', r1 && r2 && r3);
}

run().catch(console.error);

