import { connect, createServer, Socket } from 'net'

export function SelfTCP(OnConnect: (socket: Socket) => void): Promise<Socket> {
    return new Promise((res, rej) => {
        const iptest = connect({ port: 80, host: "google.com" }, async () => {
            const ip = iptest.localAddress
            const port = iptest.localPort

            //TODO: destroying ip test removes pub ip if you dont linux breaks
            //iptest.destroy()
            await listen(ip, port, OnConnect) //For this to be "0.0.0.0" ip test needs to be destroyed

            res(iptest)

            //old method 
            //I'm 99% sure this does nothing because the google connection
            //is what keep the ip public and open
            /*const SelfTCP = connect({ port, host: ip }, () => {
                SelfTCP.off('error', rej)
                iptest.off('error', rej)
                res(SelfTCP)
                //iptest.destroy()
                //destroying ip test will remove public ip
                //seems like its after a connection is closed
            })
            SelfTCP.on('error', rej)*/
        });

        iptest.on('error', rej)
    })
}

export function listen(ip: string, port: number, OnConnect: (socket: Socket) => void) {
    return new Promise((res, rej) => {
        var server = createServer(OnConnect);

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

