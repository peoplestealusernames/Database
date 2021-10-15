"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataHandler = exports.Request = exports.DataManger = void 0;
const events_1 = require("events");
const fs_1 = require("fs");
//TODO: OFFLINE MODE
class DataManger extends events_1.EventEmitter {
    constructor(Path) {
        super();
        this.Data = {};
        if (Path) {
            this.FileLocation = Path;
            try {
                this.Data = JSON.parse((0, fs_1.readFileSync)(Path, 'utf-8'));
            }
            catch (e) {
                //console.log(e)
            }
        }
    }
    Get(Path, ReqOut) {
        const Val = this.Data[Path];
        if (ReqOut)
            return JSON.stringify(new Request('PUT', Path, Val));
        return Val;
    }
    Put(Path, Val, Save) {
        //TODO: emit only option where value is not saved but passed only
        //Maybe make the this.data save if save is true
        this.Data[Path] = Val;
        if (Save)
            this.UpdateFile();
        this.emit(Path, this.Get(Path, true)); //TODO: call down the tree
        //TODO: emit with raw data rather than a get req
    }
    HandleReq(Req, Client) {
        switch (Req.method) {
            case ('GET'):
                Client.write(this.Get(Req.path, true));
                break;
            case ('PUT'):
                this.Put(Req.path, Req.data, Req.save);
                break;
            case ('LISTEN'): //TODO: allow save on listen (only when server is told to save or always)
                const CB = Client.CB;
                this.on(Req.path, CB);
                CB(this.Get(Req.path, true));
                Client.Listens.push({ path: Req.path, DM: this });
                break;
        }
    }
    StringToIndex() {
        //TODO: Impliment
    }
    TableToIndex() {
        //TODO: impliment
    }
    UpdateFile() {
        //TODO: Split into multiple files based on path to save lag
        if (!this.FileLocation)
            return;
        (0, fs_1.writeFileSync)(this.FileLocation, JSON.stringify(this.Data, null, 3));
    }
}
exports.DataManger = DataManger;
//TODO: GetReq autohandling with the EventHandler.once event
class Request {
    constructor(method, path, data, save) {
        this.method = method;
        this.path = path;
        this.data = data;
        this.save = save;
    }
}
exports.Request = Request;
function DataHandler(data, Client, DM) {
    if (typeof (data) != 'object') {
        return;
    }
    if (typeof (data) == 'object') {
        if (data.hasOwnProperty('method') && data.hasOwnProperty('path')) {
            const Req = data;
            DM.HandleReq(Req, Client);
        }
    }
}
exports.DataHandler = DataHandler;
//TODO: Set case sensitive vars ie sleep is only bool (rules file)
//TODO: Auth and login
