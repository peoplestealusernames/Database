"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const crypto_1 = require("./crypto");
const events_1 = require("events");
class Connection extends events_1.EventEmitter {
    constructor(socket) {
        super();
        this.setup = false; //TODO: Impliment along with await UntilSetup()
        this.RecHandShake = false;
        this.Encrypted = false;
        this.Listens = [];
        this.socket = socket;
        const Keys = (0, crypto_1.GenKeysSync)();
        this.publicKey = Keys.publicKey;
        this.privateKey = Keys.privateKey;
        this.socket.on('error', (data) => this.emit('error', data));
        //Err handling is required or proccess dies
        this.socket.on('close', (data) => this.emit('close', data));
        SetUpSocket(this);
        this.CB = this.CB.bind(this);
    }
    write(msg, CallBack) {
        if (!this.remotePublicKey) {
            throw new Error("Public key not recived wait for 'setup'");
        }
        const Send = (0, crypto_1.Encrypt)(this.remotePublicKey, msg);
        const SendBuf = Buffer.from(Send);
        this.socket.write(SendBuf, CallBack);
    }
    CB(data) {
        if (typeof data != 'string')
            data = JSON.stringify(data);
        this.write(data, console.log); //TODO: error handling
    }
}
exports.Connection = Connection;
function SetUpSocket(Client) {
    //TODO: on setup remove all this complex BS and just emit the data
    Client.socket.on('close', (HadErr) => {
        var _a;
        for (const k of Client.Listens) {
            k.DM.off(k.path, Client.CB);
        }
        console.log('Closed connection ' + Client.socket.remoteAddress + ":" + ((_a = Client.socket.remotePort) === null || _a === void 0 ? void 0 : _a.toString()));
    });
    Client.socket.on('data', (data) => {
        //TODO: rewrite as errors have a chance to occour
        //console.log(data.toString())
        if (Client.Encrypted) {
            var msg = (0, crypto_1.Decrypt)(Client.privateKey, data).toString();
            try {
                msg = JSON.parse(msg);
            }
            catch (e) { }
            Client.emit('data', msg);
        }
        else {
            //TODO: if condition is not validated ping back
            //TODO: make public key less obvious ie remove begin and .Pub
            try {
                const Payload = JSON.parse(data.toString());
                if (Payload.Pub) {
                    Client.remotePublicKey = Payload.Pub;
                    setTimeout(() => //TODO: remove with packet system
                     Client.socket.write("PUBREC") //TODO: send ack encypted
                    , 100);
                }
            }
            catch (err) {
                if (data.toString() === "PUBREC") {
                    Client.RecHandShake = true;
                }
                else {
                    console.log(data.toString(), err);
                }
            } //TODO: ERR handling and drop Connectionion if fails
            if (Client.remotePublicKey && Client.RecHandShake) {
                Client.Encrypted = true;
                Client.emit('setup');
            }
        }
    });
    const PubKeySend = JSON.stringify({ Pub: Client.publicKey });
    Client.socket.write(PubKeySend);
}
//TODO: Move Getsocket with retires here
//TODO: handel reconnect after 5 days (ref everyday) (dont make it auto as socket could drop)
//TODO: Autoreconnector (resend setup with is reconnect: true)
