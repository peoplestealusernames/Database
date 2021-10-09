import { connect, createServer, Socket } from 'net'

export function SelfTCP(OnConnect: (socket: Socket) => void): Promise<Socket> {
    return new Promise((res, rej) => {
        const iptest = connect({ port: 80, host: "google.com" }, async () => {
            const ip = iptest.localAddress
            const port = iptest.localPort

            await listen(ip, port, OnConnect)

            iptest.destroy()
            const SelfTCP = connect({ port, host: ip }, () => {
                res(SelfTCP)
            })
            SelfTCP.on('error', rej)
        });

        iptest.on('error', rej)
    })
}

function listen(ip: string, port: number, OnConnect: (socket: Socket) => void) {
    return new Promise((res, rej) => {
        var server = createServer(OnConnect);

        server.listen(port, ip, function () {
            console.log('listening on ', ip + ":" + port);
            res(true)
        });

        server.on('error', (err: any) => {
            if (err.code === "EADDRINUSE") {
                console.log('Address in use waiting')
            } else {
                rej(err)
            }
        })
    })
}


