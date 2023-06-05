const http = require('http');

const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/plain');
});

const port = 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
