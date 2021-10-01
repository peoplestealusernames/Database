import { request } from "https";
import { Socket } from "net";

const net = require('net');

var iptest: any
var ip = ""
var port = -1

iptest = net.connect({ port: 80, host: "google.com" }, () => {
    ip = iptest.localAddress
    port = iptest.localPort
    SendToDB()
    StartServerTCP()
});

function SendToDB() {
    const Update = { ip, port }
    const Send = JSON.stringify(Update)

    const options = {
        //TODO: hostname to file
        hostname: 'firebase',
        port: 443,
        path: '/client/a.json',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const req = request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
    })

    req.on('error', error => {
        console.error(error)
    })

    req.write(Send)
    req.end()
}

//
// Waiting for connection
//

var tunnelSocket: Socket

var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function StartServerTCP() {
    var server = require('net').createServer(function (socket: Socket) {
        tunnelSocket = socket
        console.log('> (clientA) someone connected, it\s:', socket.remoteAddress, socket.remotePort);
        socket.write("Hello there NAT traversal man, this is a message from a client behind a NAT!");

        socket.on('data', function (data) {
            console.log(data.toString());
        });

        socket.on('error', (err: any) => { console.log(err) })

        NewRead()
    }).listen(port, ip, function (err: any) {
        if (err) return console.log(err);
        console.log('> (clientA) listening on:', ip + ':' + port);
    });
}

function NewRead() {
    rl.question('Say something to B:', function (stuff: any) {
        tunnelSocket.write(stuff);

        NewRead();
    });
}

