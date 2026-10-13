const http = require('http');

http.get('http://localhost:3000/stores', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const idx = data.indexOf('/store/amazon');
    console.log(data.substring(idx + 2400, idx + 2700));
  });
});

