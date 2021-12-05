import { EventEmitter } from 'events'
import { Connection } from './ConnectionClass'
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'

export class DataManger extends EventEmitter {
    private FileLocation: string

    constructor(FilePath: string) {
        super()

        if (!existsSync(FilePath)) {
            throw new Error("Path given does not exist")
        }

        if (FilePath[FilePath.length - 1] !== "/")
            FilePath += "/"

        this.FileLocation = FilePath
    }

    public Get(Path: string, RequestOut = false) {
        var GPath = this.FileLocation + Path

        if (existsSync(GPath + ".json"))
            GPath += ".json"
        const Ret = this.BuildTable(GPath)
        if (RequestOut)
            return JSON.stringify(Ret)
        else
            return Ret
    }

    public Put(Path: string, Val: any, Save = true) {
        //TODO: Reimpiment when save is false
        //TODO: purge all data as Put is not Post
        //TODO: situation where folder and file.json exists
        this.BreakDownTable(this.FileLocation + Path, Val)

        this.emit(Path, this.Get(Path, true))
    }

    public HandleReq(Req: Request, Client: Connection) {
        switch (Req.method) {
            case ('GET'):
                Client.write(this.Get(Req.path, true))
                break

            case ('PUT'):
                this.Put(Req.path, Req.data, Req.save)
                break

            case ('LISTEN'): //TODO: allow save on listen (only when server is told to save or always)
                const CB = Client.CB
                this.on(Req.path, CB)
                CB(this.Get(Req.path, true))
                Client.Listens.push({ path: Req.path, DM: this })
                break
        }
    }

    private BreakDownTable(Path: string, Data: any) {
        if (typeof (Data) != "object")
            WriteFile(Path + ".json", JSON.stringify(Data))
        else
            Object.keys(Data).forEach(key => {
                this.BreakDownTable(Path + "/" + key, Data[key])
            })
    }

    private BuildTable(Path: string) {
        //TODO: find way to not crash with recursive folder

        if (lstatSync(Path).isFile())
            try {
                return JSON.parse(readFileSync(Path, { encoding: 'utf8' }))
            } catch (e) {
                if (e && typeof (e) == 'object' &&
                    e.toString().includes("Unexpected end of JSON input"))
                    console.error("Potental data corruption at " + Path)
                else
                    console.error(e)
                return
            }
        else {
            var Files = readdirSync(Path)
            var Obj: { [key: string]: any } = {}
            Files.forEach(x1Path => {
                Obj[x1Path] = this.BuildTable(Path + "/" + x1Path)
            });
            return Obj
        }
    }
}

//TODO: GetReq autohandling with the EventHandler.once event

function WriteFile(Path: string, Val: string) {
    const DirA = Path.split('/')
    delete DirA[DirA.length - 1]
    const Dir = DirA.join("/")
    mkdirSync(Dir, { recursive: true })
    writeFileSync(Path, Val)
}

export class Request {
    path: string
    method: 'GET' | 'PUT' | 'LISTEN'
    data?: any
    save?: boolean
    constructor(method: 'GET' | 'PUT' | 'LISTEN', path: string, data?: any, save?: boolean) {
        this.method = method
        this.path = path
        this.data = data
        this.save = save
    }
}

export function DataHandler(data: string | object, Client: Connection, DM: DataManger) {
    if (typeof (data) != 'object') {
        return
    }

    if (typeof (data) == 'object') {
        if (data.hasOwnProperty('method') && data.hasOwnProperty('path')) {
            const Req = data as Request
            DM.HandleReq(Req, Client)
        }
    }
}

//TODO: Set case sensitive vars ie sleep is only bool (rules file)
//TODO: Auth and login