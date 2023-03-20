const http = require("http");
const PORT = 8080;

// a function which handles requests and sends response
const requestHandler = function (request, response) {
  let responseText = [`Requested Path: ${request.url}\nRequest Method: ${request.method}`];
  if (request.url == '/') {
    responseText.unshift('Welcome to localhost:8080! \n\n valid paths: /dog, /cat, /urls \n\n')
  }
  if (request.url == '/urls') {
    response.end('https://www.youtube.com/watch?v=FYz0pXNS-3U&list=PLEiOTsktKIotkjt3fP45HP9yWrP_s5_iI&index=42')
  } 
  if (request.url == '/dog') {
    console.log('dog')
    responseText += '\ndog alert!'
  }
  if (request.url == '/cat') {
    console.log('cat')
    responseText += '\ncat alert!'
  }
  response.statuscode = 404;
  // console.log('heres the request:',request)  //so much info
  response.end('❌‼️ 404 page not found ‼️❌')
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});