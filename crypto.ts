//65535
//String.fromCharCode(65535).charCodeAt(0)

export function GenKeysSync(keyLength = 100) {
    var Key = ""
    for (let i = 0; i < keyLength; i++) {
        Key += String.fromCharCode(Math.random() * 60000)
    }
    return {
        publicKey: Key,
        privateKey: Key
    }
}

export function Encrypt(publicKey: string, Text: string) {
    var Ret = ""
    for (let i = 0; i < Text.length; i++) {
        let shift = i % publicKey.length
        Ret += String.fromCharCode(publicKey.charCodeAt(shift) - Text.charCodeAt(i))
    }
    return Buffer.from(Ret)
}

export function Decrypt(privateKey: string, Data: NodeJS.ArrayBufferView | string) {
    var Text = Data.toString()
    var Ret = ""
    for (let i = 0; i < Text.length; i++) {
        let shift = i % privateKey.length
        Ret += String.fromCharCode(privateKey.charCodeAt(shift) - Text.charCodeAt(i))
    }
    return Ret
}

Test()
async function Test() {
    const Keys = GenKeysSync()
    const Text = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    const Msg = Encrypt(Keys.publicKey, Text)
    const Rec = Decrypt(Keys.privateKey, Msg)
    console.log(Text, '\n', Msg, '\n', Rec, '\n', Text === Rec)
}