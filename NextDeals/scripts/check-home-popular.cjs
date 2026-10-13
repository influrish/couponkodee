const http = require('http');

http.get('http://localhost:3000/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Homepage length:', data.length);
    console.log('Has id="stores":', data.includes('id="stores"'));
    console.log('Has store-card:', data.includes('store-card'));
    const idx = data.indexOf('store-card');
    if (idx !== -1) {
      console.log('Snippet around store-card:', data.substring(idx - 100, idx + 500));
    }
  });
});

