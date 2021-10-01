import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import { Socket, createServer, createConnection } from "net";

var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const firebaseConfig = {
};

var user
var tunnelSocket: Socket

const app = initializeApp(firebaseConfig);

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
//TODO: Move to file
signInWithEmailAndPassword(auth, "@gmail.com", "")
    .then((userCredential) => {
        // Signed in 
        user = userCredential.user;
        signedIn()
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });

function signedIn() {
    const db = getDatabase(app);
    const DBRef = ref(db, 'client')

    console.log("ready")

    onValue(DBRef, (snapshot: any) => {
        const data = snapshot.val();
        NewIP(data)
    }, (err: any) => {
        if (err) {
            console.log(err)
        } else {
            console.log('connected')
        }
    });

}

function NewIP(data: any) {
    console.log(data)
    for (const k in data) {
        Connect(data[k].ip, data[k].port).catch((e: any) => { console.log(e) })
    }
}

var tunnelEstablished = true//FIX
var c: Socket

async function Connect(ip: string, port: number) {
    c = require('net').createConnection({ host: ip, port }, function () {
        console.log('> (clientB) connected to clientA!');

        listen(c.localAddress, c.localPort);

        c.on('data', function (data: any) {
            console.log(data.toString());
        });
        NewRead();
    });
}

function listen(ip: string, port: number) {
    var server = require('net').createServer(function (socket: Socket) {
        tunnelSocket = socket;

        console.log('> (A) someone connected, it\s:', socket.remoteAddress, socket.remotePort);

        socket.write("Hello there NAT traversal man, you are connected to A!");
        tunnelEstablished = true;

        NewRead();
    });

    server.listen(port, ip, function (err: any) {
        if (err) return console.log(err);
        console.log('> (A) listening on ', ip + ":" + port);
    });
}

function NewRead() {
    rl.question('Say something to B:', function (stuff: any) {
        c.write(stuff);

        NewRead();
    });
}

process.on('uncaughtException', (err: any) => {
    console.log(err)
});