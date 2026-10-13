const http = require('http');

http.get('http://localhost:3000/store/acer', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const lines = data.split('\n');
    const matchedLines = lines.filter(l => /offer/i.test(l));
    console.log('Lines matching offer:', matchedLines.slice(0, 10));
    // Also look at text around Total Active Offers
    const idx = data.indexOf('Total Active Offers');
    if (idx !== -1) {
      console.log('Snippet around Total Active Offers:', data.substring(idx - 100, idx + 200));
    }
    const idx2 = data.indexOf('Live Offer');
    if (idx2 !== -1) {
      console.log('Snippet around Live Offer:', data.substring(idx2 - 100, idx2 + 200));
    }
  });
});

