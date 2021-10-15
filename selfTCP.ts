import { connect, createServer, Socket } from 'net'

export function SelfTCP(OnConnect: (socket: Socket) => void): Promise<Socket> {
    return new Promise((res, rej) => {
        const iptest = connect({ allowHalfOpen: true, port: 80, host: "google.com" }, async () => {
            const ip = iptest.localAddress
            const port = iptest.localPort

            //TODO: iptest destory removes pub ip but breaks linux
            iptest.destroy()
            await listen("0.0.0.0", port, OnConnect) //For this to be "0.0.0.0" ip test needs to be destroyed

            const SelfTCP = connect({ port, host: ip }, () => {
                SelfTCP.off('error', rej)
                iptest.off('error', rej)
                res(SelfTCP)
                //TODO: does not work offnetwork
                //iptest.destroy() //TODO: this is allowed and keeps ip pub
                //But its not needed?
            })
            SelfTCP.on('error', rej)
        });

        iptest.on('error', rej)
    })
}

function listen(ip: string, port: number, OnConnect: (socket: Socket) => void) {
    return new Promise((res, rej) => {
        var server = createServer({ allowHalfOpen: true }, OnConnect);

        server.listen(port, ip, function () {
            console.log('listening on ', ip + ":" + port);
            res(true)
        });

        server.on('error', (err: any) => {
            if (err.code === "EADDRINUSE") {
                console.log('Address in use retrying')
                setTimeout(() => {
                    server.close()
                    server.listen(port, ip)
                }, 1000)
            } else {
                rej(err)
            }
        })
    })
}


