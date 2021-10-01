import { connect } from 'net'

export function SelfTCP(ConnectFNC: Function) {
    new Promise((res, rej) => {
        const iptest = connect({ port: 80, host: "google.com" }, () => {
            const ip = iptest.localAddress
            const port = iptest.localPort

            listen(ip, port, ConnectFNC)

            const SelfTCP = connect({ port, host: ip }, () => {
                iptest.destroy()
                res(SelfTCP)
            })
            SelfTCP.on('error', (err: any) => { rej(err) })
        });

        iptest.on('error', (err: any) => { rej(err) })
    })
}

function listen(ip: string, port: number, ConnectFNC: Function) {
    var server = require('net').createServer(ConnectFNC);

    server.listen(port, ip, function (err: any) {
        if (err) return console.log(err);
        console.log('listening on ', ip + ":" + port);
    });
}


