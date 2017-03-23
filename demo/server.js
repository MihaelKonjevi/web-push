var webPush = require('../index');
var https   = require('https');
var fs      = require('fs');
var path    = require('path');

var pem = fs.readFileSync('test/cert.pem');

var options = {
  key: pem,
  cert: pem,
};

var server = https.createServer(options, function(req, res) {
  if (req.method === 'GET') {
    if (req.url === '/') {
      req.url = '/index.html';
    }

    if (!fs.existsSync('demo' + req.url)) {
      res.writeHead(404);
      res.end(data);
      return;
    }

    var data = fs.readFileSync('demo' + req.url);

    res.writeHead(200, {
      'Content-Length': data.length,
      'Content-Type': path.extname(req.url) === '.html' ? 'text/html' : 'application/javascript',
    });

    res.end(data);
  } else {
    var body = '';

    req.on('data', function(chunk) {
      body += chunk;
    })

    req.on('end', function() {
      var obj = JSON.parse(body);
      webPush.sendNotification(obj.endpoint, obj.key, 'marco');
    });

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    });

    res.end('ok');
  }
}).listen(50005);

server.listening = false;
server.on('listening', function() {
  server.listening = true;
});

module.exports = server;
