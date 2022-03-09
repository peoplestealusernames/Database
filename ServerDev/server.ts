import localtunnel from 'localtunnel';
import http from 'http';
import { WebSocketServer } from 'ws';
import { DataManger, Request } from 'tenk-database/ts/index'

const DM = new DataManger("Data")

//TODO: Login system

const server = http.createServer((req, res) => {
    console.log(req.socket.remoteAddress)
    let Data = ""
    //console.log(req.method)
    /*
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    */
    req.on('data', (chunk) => { Data += chunk })

    req.on('end', () => {
        if (req.headers['content-type'] == "application/json")
            Data = JSON.parse(Data)

        if (req.url && req.method) {
            const URLBreak = req.url.split('/')
            URLBreak.splice(0, 1)

            if (URLBreak[0] == "api" && URLBreak[1] == "data") {
                const PathArr = URLBreak
                PathArr.splice(0, 2)
                const Path = PathArr.join('/')

                res.setHeader('Content-Type', 'application/json');

                //TODO: Codes and error handling
                if (req.method == "GET") {
                    const Ret = JSON.stringify(DM.Get(Path))
                    res.end(Ret)
                    console.log(req.method, Path, Ret)
                    return
                }

                if (req.method == "PUT") {
                    const Ret = JSON.stringify(DM.Put(Path, Data))
                    res.end(Ret)
                    console.log(req.method, Path, Data, Ret)
                    return
                }

            }
        }

        res.end('ok');
    })
});

const wss = new WebSocketServer({ server });
wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log(JSON.parse(data.toString()))
        DM.HandleReq(JSON.parse(data.toString()),
            (data: Request) => {
                console.log("out", data)
                ws.send(Buffer.from(JSON.stringify(data)))
            })
    });
});

server.listen(5000, "localhost")

//TODO: subdomain from file
/*const tunnel = localtunnel(5000, { subdomain: 'leserver102' }, (err, tunnel) => {
    console.log(tunnel?.url)
});

tunnel.on('close', function () {
    // When the tunnel is closed
});
*/