const http = require('http');

http.get('http://localhost:3000/stores', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const idx = data.indexOf('/store/dominos');
    console.log(data.substring(idx + 1000, idx + 3000));
  });
});

