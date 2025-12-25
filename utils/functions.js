import fs from 'fs/promises'


export async function read(path) {
    try {
        let data = await fs.readFile(path, "utf-8")
        return await JSON.parse(data)
    } catch (err) {
        console.log(err)
    }
}

export async function write(path, data) {
    try {
        await fs.writeFile(path, JSON.stringify(data, null, 2),"utf-8")
    } catch (err) {
        console.log(err)
    }

}