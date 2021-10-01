import { Socket } from 'net'
import { SelfTCP } from './selfTCP'

Run()

var ip: string
var port: number
var selfSocket: Socket

async function Run() {
    SelfTCP(NewSocket)
}

function NewSocket(socket: Socket) {
    if (!selfSocket) {
        selfSocket = socket
        //@ts-ignore
        ip = socket.remoteAddress
        //@ts-ignore
        port = socket.remotePort
    }

    console.log('New connection ' + socket.remoteAddress + ":" + socket.remotePort?.toString())

    socket.on('data', function (data) {
        console.log(data.toString());
    });

    socket.on('error', (err: any) => { console.log(err) })
}
