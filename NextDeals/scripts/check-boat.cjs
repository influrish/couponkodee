const http = require('http');

http.get('http://localhost:3000/store/boat', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const idx = data.indexOf('Live Offer');
    console.log('Boat store page:', data.substring(idx - 20, idx + 40));
  });
});

