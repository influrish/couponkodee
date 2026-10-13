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

async function checkAllStoresDirectory() {
  const storesHtml = await fetchPage('http://localhost:3000/stores');
  
  // Split into cards by card wrapper
  const parts = storesHtml.split('hover:border-purple-300 hover:shadow-md transition-all');
  // First part is before the cards
  const cardChunks = parts.slice(1);

  let count = 0;
  let allMatched = true;

  console.log('----------------------------------------------------');
  console.log('CHECKING ALL STORES ON /stores DIRECTORY:');
  console.log('----------------------------------------------------');

  for (const chunk of cardChunks) {
    const slugMatch = chunk.match(/href="\/store\/([^"]+)"/);
    const nameMatch = chunk.match(/class="font-black text-\[15px\][^"]*"[^>]*>([^<]+)<\/a>/);
    const offersMatch = chunk.match(/Offers:<\/span>[\s\S]*?<span[^>]*class="font-bold text-purple-700"[^>]*>([\s\S]*?)<\/span>/);

    if (!slugMatch || !nameMatch || !offersMatch) continue;

    count++;
    const slug = slugMatch[1];
    const name = nameMatch[1];
    const numMatch = offersMatch[1].match(/(\d+)/);
    const storesDirCount = numMatch ? parseInt(numMatch[1], 10) : null;

    const storeData = await fetchPage(`http://localhost:3000/store/${slug}`);
    const summaryMatch = storeData.match(/Total Active Offers<\/dt><dd class="[^"]*">(\d+)<\/dd>/i);
    const storeCount = summaryMatch ? parseInt(summaryMatch[1], 10) : null;

    const isMatch = storesDirCount === storeCount;
    if (!isMatch) allMatched = false;

    console.log(`[${String(count).padStart(2)}] ${name.padEnd(20)} (slug: ${slug.padEnd(14)}): /stores = ${storesDirCount}, /store/${slug} = ${storeCount} -> ${isMatch ? 'MATCH: YES' : 'MISMATCH: NO'}`);
  }

  console.log('----------------------------------------------------');
  console.log(`Verified ${count} stores on /stores. All matched: ${allMatched}`);
  console.log('----------------------------------------------------');
}

checkAllStoresDirectory().catch(console.error);

