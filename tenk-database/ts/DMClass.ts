import { EventEmitter } from 'events'
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { Request } from './RequestClass'

export class DataManger extends EventEmitter {
    private FileLocation: string

    constructor(FilePath: string) {
        super()

        if (!existsSync(FilePath)) {
            throw new Error("Path given does not exist")
        }

        if (FilePath[FilePath.length - 1] === "/")
            FilePath = FilePath.slice(0, FilePath.length - 2)[0]

        this.FileLocation = FilePath
    }

    public Get(Path: string, RequestOut = false) {
        var GPath = this.FileLocation + '/' + Path

        let Ret = null

        if (existsSync(GPath + ".json"))
            GPath += ".json"

        if (existsSync(GPath))
            Ret = this.BuildTable(GPath)

        if (RequestOut)
            return new Request('PUT', Path, Ret)
        else
            return Ret
    }

    public Put(Path: string, Val: any, Save = true) {
        //TODO: Reimpiment when save is false
        //TODO: purge all data as Put is not Post
        //TODO: situation where folder and file.json exists
        this.BreakDownTable(this.FileLocation + Path, Val)
    }

    public HandleReq(Req: Request, CallBack: (Data: Request) => void) {
        switch (Req.method) {
            case ('GET'):
                CallBack(this.Get(Req.path, true))
                break

            case ('PUT'):
                this.Put(Req.path, Req.data, Req.save)
                break

            case ('LISTEN'): //TODO: allow save on listen (only when server is told to save or always)
                //TODO: a listener to how many listeners are tuned in to prevent over sending
                this.on(Req.path, CallBack)
                CallBack(this.Get(Req.path, true))
                //TODO: Remove listener automaticly
                //TODO: Remove caller on error
                break
        }
    }

    private BreakDownTable(Path: string, Data: any) {
        if (typeof (Data) != "object") {
            WriteFile(Path + ".json", JSON.stringify(Data))
        } else {
            Object.keys(Data).forEach(key => {
                const Place = Path + "/" + key
                this.BreakDownTable(Place, Data[key])

                const Grab = Place.slice(this.FileLocation.length + 1, Place.length)
                //console.log(Grab, Place)
                //TODO: format into request instead of regrabbing
                //TODO: check for listeners first
                this.emit(Grab, this.Get(Grab, true))
            })
        }
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
                var K = x1Path
                if (K.slice(-5) == '.json')
                    K = K.substr(0, K.length - 5)
                Obj[K] = this.BuildTable(Path + "/" + x1Path)
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

//TODO: Set case sensitive vars ie sleep is only bool (rules file)
//TODO: Auth and login