const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((request, response) => {
  const { url } = request;

  if (url === '/') {
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
  } else if (url === '/style.css') {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/css');

    fs.readFile('style.css', 'utf8', (error, data) => {
      if (error) {
        response.statusCode = 500;
        response.end('Internal Server Error');
      } else {
        response.end(data);
      }
    });
  } else if (url === '/script.js') {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/javascript');

    fs.readFile('script.js', 'utf8', (error, data) => {
      if (error) {
        response.statusCode = 500;
        response.end('Internal Server Error');
      } else {
        response.end(data);
      }
    });
  } else {
    response.statusCode = 404;
    response.end('Not Found');
  }
});

const port = 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
