import { createServer, Socket } from 'net'
import { Connection } from "./ConnectionClass"
import { GetSocket } from "./ClientAPI"

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