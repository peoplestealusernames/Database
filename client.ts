import { Connection } from "./ConnectionClass"
import { DataHandler, DataManger, Request } from "./DMClass"
import { GetSocket } from "./ClientAPI"

start()
async function start() {
    const Server = await GetSocket()
    Server.write(JSON.stringify(Send))
    Server.on('data', (msg) => DataRec(msg, Server))
}

/*const Send: Request = {
    method: 'PUT',
    path: 'test',
    data: 'Aye',
    save: true
}*/
//const Send = {    method: 'PUT',    path: 'test',    data: 'Aye',    save: true}
//const Send = {    method: 'GET',    path: 'test',    data: 'Aye',    save: true}

//const Send: Request = new Request('PUT', 'test', 'lets go')
//const Send: Request = new Request('PUT', 'RGB', { r: 255, g: 255, b: 255 }, true)
const Send: Request = new Request('PUT', 'SleepScreen', false, true)

const DM = new DataManger('./Pass/ClientData.json')

function DataRec(data: string | object, Client: Connection) {
    console.log(data)
    if (data === 'PING') {
        Client.write('PONG')
    }

    DataHandler(data, Client, DM)
}
