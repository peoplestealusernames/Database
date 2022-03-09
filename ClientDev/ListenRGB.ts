import { WebSocket } from "ws";
import { Request } from 'tenk-database/ts/index'

const ws = new WebSocket('ws://localhost:5000');

ws.once('open', () => {
    console.log("Open")

    const Req = new Request('LISTEN', 'RGB')
    ws.send(Buffer.from(JSON.stringify(Req)))
})

ws.on('message', (data) => console.log(JSON.parse(data.toString())))

ws.on('error', console.log)
ws.on('close', console.log)