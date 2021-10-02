import { Socket } from 'net'
import { KeyObject, createPrivateKey } from 'crypto'
import { Encrypt, Decrypt, GenKeysSync } from './crypto'
import { EventEmitter } from 'events'

interface ConnectEvents {
    'data': (data: Object | string) => void;
    'setup': () => void
}

export declare interface Connect {
    on<U extends keyof ConnectEvents>(
        event: U, listener: ConnectEvents[U]
    ): this;

    emit<U extends keyof ConnectEvents>(
        event: U, ...args: Parameters<ConnectEvents[U]>
    ): boolean;
}

export class Connect extends EventEmitter {
    public socket: Socket

    public publicKey: string
    private privateKey: string
    public privateKeyObj: KeyObject

    public remotePublicKey?: string
    public RecHandShake = false
    public Encrypted = false

    public constructor(socket: Socket) {
        super()
        this.socket = socket
        const Keys = GenKeysSync()
        this.publicKey = Keys.publicKey
        this.privateKey = Keys.privateKey
        this.privateKeyObj = createPrivateKey({
            key: this.privateKey,
            type: 'pkcs8',
            format: 'pem',
            //TODO:Passphrase
            passphrase: 'top secret',
        })

        SetUpSocket(this)
    }

    public write(msg: string, cb?: (err?: Error) => void) {
        if (!this.remotePublicKey) {
            throw new Error("Public key not recived wait for 'setup'")
        }
        const Send = Encrypt(this.remotePublicKey, msg)
        this.socket.write(Send, cb)
    }
}

function SetUpSocket(Client: Connect) {
    Client.socket.on('data', (data) => {
        //console.log(data)
        if (Client.Encrypted) {
            var msg = Decrypt(Client.privateKeyObj, data).toString()
            try { msg = JSON.parse(msg) } catch (e) { }
            Client.emit('data', msg)
        } else {
            //TODO: if condition is not validated ping back
            //TODO: make public key less obvious ie remove begin and .Pub
            try {
                const Payload = JSON.parse(data.toString())
                if (Payload.Pub) {
                    Client.remotePublicKey = Payload.Pub
                    Client.socket.write("PUBREC") //TODO: send ack encypted
                }
            } catch (err) {
                if (data.toString() === "PUBREC") {
                    Client.RecHandShake = true
                } else {
                    console.log(err)
                }
            } //TODO: ERR handling and drop connection if fails
            if (Client.remotePublicKey && Client.RecHandShake) {
                Client.Encrypted = true
                Client.emit('setup')
            }
        }
    })

    const PubKeySend = JSON.stringify({ Pub: Client.publicKey })
    Client.socket.write(PubKeySend)
}
