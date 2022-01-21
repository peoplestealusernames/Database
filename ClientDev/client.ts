import { Request, Client } from "tenk-database/ts/index"

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
var Send = new Request('LISTEN', 'RGB')

const Server = new Client("localhost", 5555)

Server.on('setup', () => {
    Server.get('RGB').then((data) => { console.log("AYE ", data) })
})
