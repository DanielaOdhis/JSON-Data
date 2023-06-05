const http = require('http');
const fs = require('fs');

const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/html');

  fs.readFile('index.html', 'utf8', (error, data) => {
    if (error) {
      response.statusCode = 500;
      response.end('Internal Server Error');
    } else {
      response.end(data);
    }
  });
});

const port = 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
