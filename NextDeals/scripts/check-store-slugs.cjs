const http = require('http');

http.get('http://localhost:3000/stores', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /href="\/store\/([^"]+)"/g;
    let match;
    const slugs = new Set();
    while ((match = regex.exec(data)) !== null) {
      slugs.add(match[1]);
    }
    console.log('Slugs found on /stores (page 1):', Array.from(slugs));
  });
});

