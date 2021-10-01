var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var tunnelSocket;

// clientB.js
// read the server's output to find the public endpoint of A:
//TODO: get from readline
var c = require('net').createConnection({host: 'publicip', port: enterport}, function ()
{
  console.log('> (clientB) connected to clientA!');

  listen(c.localAddress, c.localPort);

  c.on('data', function (data)
  {
    console.log(data.toString());
  });
  NewRead();
});

function listen(ip, port)
{
  var server = require('net').createServer(function (socket)
  {
    tunnelSocket = socket;

    console.log('> (A) someone connected, it\s:', socket.remoteAddress, socket.remotePort);

    socket.write("Hello there NAT traversal man, you are connected to A!");
    tunnelEstablished = true;

    NewRead();
  });

  server.listen(port, ip, function (err)
  {
    if (err) return console.log(err);
    console.log('> (A) listening on ', ip + ":" + port);
  });
}

function NewRead()
{
  rl.question('Say something to B:', function (stuff)
  {
    c.write(stuff);

    NewRead();
  });
}