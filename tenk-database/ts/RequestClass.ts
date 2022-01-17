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