import { connect, createServer, Socket } from 'net'

export function SelfTCP(OnConnect: (socket: Socket) => void): Promise<Socket> {
    return new Promise((res, rej) => {
        const iptest = connect({ port: 80, host: "google.com" }, () => {
            const ip = iptest.localAddress
            const port = iptest.localPort

            listen(ip, port, OnConnect)

            const SelfTCP = connect({ port, host: ip }, () => {
                iptest.destroy()
                res(SelfTCP)
            })
            SelfTCP.on('error', (err: any) => { rej(err) })
        });

        iptest.on('error', (err: any) => { rej(err) })
    })
}

function listen(ip: string, port: number, OnConnect: (socket: Socket) => void) {
    var server = createServer(OnConnect);

    server.listen(port, ip, function () {
        console.log('listening on ', ip + ":" + port);
    });

    server.on('error', (err: any) => console.log(err))
}


