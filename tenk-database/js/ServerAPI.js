"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const selfTCP_1 = require("./selfTCP"); //TODO: ServerAPI
const ConnectionClass_1 = require("./ConnectionClass");
const events_1 = require("events");
const process_1 = require("process");
class Server extends events_1.EventEmitter {
    constructor(NatPunch = true, port, ip = "0.0.0.0") {
        //TODO : setup callback
        //TODO: non selfTCP varient for port forwarding
        super();
        this.Setup = false; //TODO: await UntilSetup()
        if (NatPunch) {
            this.NatPunch();
        }
        else {
            this.ip = ip;
            this.port = port;
            if (!this.port)
                if (process_1.env.PORT) {
                    this.port = parseInt(process_1.env.PORT);
                }
                else {
                    throw new Error("No 'port' enviorment variable. and no port arg.");
                }
            (0, selfTCP_1.listen)(this.ip, this.port, this.NewSocket.bind(this));
        }
    }
    NatPunch() {
        return __awaiter(this, void 0, void 0, function* () {
            this.selfSocket = yield (0, selfTCP_1.SelfTCP)(this.NewSocket.bind(this));
            //TODO: double check I'm 50% sure this will break
            this.ip = this.selfSocket.localAddress;
            this.port = this.selfSocket.localPort;
        });
    }
    NewSocket(socket) {
        //@ts-ignore
        console.log('New connection ' + socket.remoteAddress + ":" + socket.remotePort.toString());
        const Client = new ConnectionClass_1.Connection(socket);
        this.emit('client', Client);
    }
}
exports.Server = Server;
