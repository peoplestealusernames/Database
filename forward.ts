import { request } from "https"
import { readFileSync } from "fs"
import { connect, createServer, Socket } from 'net'
import { Connection } from "./ConnectionClass"

const Path = JSON.parse(readFileSync('./Pass/HostName.json', 'utf-8'))

function GetIP(): Promise<{ port: number, ip: string }> {
    return new Promise((resolve, rej) => {
        const req = request(Path, { method: 'GET' }, res => {
            res.on('data', (data: any) => {
                resolve(JSON.parse(data))
            })
        })

        req.on('error', error => {
            rej(error)
        })

        req.end()
    })
}

function GetSocket(): Promise<Connection> {
    return new Promise(async (resolve, rej) => {
        const HostAdress = await GetIP()
        const socket = connect({ port: HostAdress.port, host: HostAdress.ip })
        //TODO:Retry

        const Server = new Connection(socket)

        Server.on('setup', () => { resolve(Server) })

        socket.on('error', rej)
    })
}

/////////////////////////
//END OF CLIENT REC
//START OF CLIENT HANDLING
/////////////////////////

listen('localhost', 7562, NewSocket)

function listen(ip: string, port: number, OnConnect: (socket: Socket) => void) {
    var server = createServer(OnConnect);

    server.listen(port, ip, function () {
        console.log('listening on ', ip + ":" + port);
    });

    server.on('error', (err: any) => console.log(err))
}

async function NewSocket(socket: Socket) {
    console.log('New connection ' + socket.remoteAddress + ":" + socket.remotePort?.toString())

    const Server = await GetSocket()
    Server.socket.on('close', () => { socket.end() })
    socket.on('close', () => { Server.socket.end() })
    socket.on('close', () => { console.log('aye') })

    Server.on('data', (data) => {
        if (typeof data != 'string')
            data = JSON.stringify(data)
        socket.write(data)
    })

    socket.on('data', (data) => { Server.write(data.toString()) })
}