import { Socket } from 'net'
import { Encrypt, Decrypt, GenKeysSync } from './crypto'
import { EventEmitter } from 'events'

interface ConnectionEvents {
    'data': (data: object | string) => void;
    'setup': () => void //TODO: error and closed
}

export declare interface Connection {
    on<U extends keyof ConnectionEvents>(
        event: U, listener: ConnectionEvents[U]
    ): this;

    emit<U extends keyof ConnectionEvents>(
        event: U, ...args: Parameters<ConnectionEvents[U]>
    ): boolean;
}

export class Connection extends EventEmitter {
    public socket: Socket

    public publicKey: string
    public privateKey: string
    public setup: boolean = false //TODO: Impliment along with await UntilSetup()

    public remotePublicKey?: string
    public RecHandShake = false
    public Encrypted = false

    public Listens: { DM: EventEmitter, path: string }[] = []

    public constructor(socket: Socket) {
        super()
        this.socket = socket
        const Keys = GenKeysSync()
        this.publicKey = Keys.publicKey
        this.privateKey = Keys.privateKey

        SetUpSocket(this)

        this.CB = this.CB.bind(this)
    }

    public write(msg: string, CallBack?: (err?: Error) => void) {
        if (!this.remotePublicKey) {
            throw new Error("Public key not recived wait for 'setup'")
        }
        const Send = Encrypt(this.remotePublicKey, msg)
        const SendBuf = Buffer.from(Send)
        this.socket.write(SendBuf, CallBack)
    }

    public CB(data: object | string) {
        if (typeof data != 'string')
            data = JSON.stringify(data)

        this.write(data, console.log)//TODO: error handling
    }
}

function SetUpSocket(Client: Connection) {
    //TODO: on setup remove all this complex BS and just emit the data
    Client.socket.on('close', (HadErr) => {
        for (const k of Client.Listens) {
            k.DM.off(k.path, Client.CB)
        }
        console.log('Closed connection ' + Client.socket.remoteAddress + ":" + Client.socket.remotePort?.toString())
    })

    Client.socket.on('data', (data) => {
        //TODO: rewrite as errors have a chance to occour
        //console.log(data.toString())
        if (Client.Encrypted) {
            var msg = Decrypt(Client.privateKey, data).toString()
            try { msg = JSON.parse(msg) } catch (e) { }
            Client.emit('data', msg)
        } else {
            //TODO: if condition is not validated ping back
            //TODO: make public key less obvious ie remove begin and .Pub
            try {
                const Payload = JSON.parse(data.toString())
                if (Payload.Pub) {
                    Client.remotePublicKey = Payload.Pub
                    setTimeout(() =>
                        Client.socket.write("PUBREC") //TODO: send ack encypted
                        , 100)
                }
            } catch (err) {
                if (data.toString() === "PUBREC") {
                    Client.RecHandShake = true
                } else {
                    console.log(data.toString(), err)
                }
            } //TODO: ERR handling and drop Connectionion if fails
            if (Client.remotePublicKey && Client.RecHandShake) {
                Client.Encrypted = true
                Client.emit('setup')
            }
        }
    })

    const PubKeySend = JSON.stringify({ Pub: Client.publicKey })
    Client.socket.write(PubKeySend)
}

//TODO: Move Getsocket with retires here
//TODO: handel reconnect after 5 days (ref everyday) (dont make it auto as socket could drop)
//TODO: Autoreconnector (resend setup with is reconnect: true)