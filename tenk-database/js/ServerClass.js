"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const selfTCP_1 = require("./selfTCP"); //TODO: ServerAPI
//import { UpdateIP, LogIn } from './FBPut' //TODO: ServerAPI with arg
const ConnectionClass_1 = require("./ConnectionClass");
const events_1 = require("events");
class Server extends events_1.EventEmitter {
    constructor() {
        //TODO : setup callback
        //TODO: non selfTCP varient for port forwarding
        super();
        this.Setup = false; //TODO: await UntilSetup()
        (0, selfTCP_1.SelfTCP)(this.NewSocket.bind(this));
    }
    NewSocket(socket) {
        if (!this.selfSocket) {
            this.selfSocket = socket;
            //@ts-ignore
            this.ip = socket.localAddress;
            //@ts-ignore
            this.port = socket.localPort;
            //@ts-ignore
            console.log("Self connection from " + socket.remoteAddress + ":" + socket.remotePort.toString());
            this.Setup = true;
            this.emit('setup');
        }
        else {
            //@ts-ignore
            console.log('New connection ' + socket.remoteAddress + ":" + socket.remotePort.toString());
            const Client = new ConnectionClass_1.Connection(socket);
            this.emit('client', Client);
        }
    }
}
exports.Server = Server;
