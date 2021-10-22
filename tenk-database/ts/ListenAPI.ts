import { connect, createServer, Socket } from 'net'

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


