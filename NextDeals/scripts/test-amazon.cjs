const http = require('http');

http.get('http://localhost:3000/store/amazon', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const idx = data.indexOf('Live Offer');
    if (idx !== -1) {
      console.log('Amazon /store/amazon:', data.substring(idx - 40, idx + 60));
    }
    const idx2 = data.indexOf('Total Active Offers');
    if (idx2 !== -1) {
      console.log('Amazon Total Active Offers:', data.substring(idx2 - 40, idx2 + 100));
    }
  });
});

