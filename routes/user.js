import express from 'express'
import { read, write } from '../utils/functions.js'

const userRouter = express()
const USERS_DATA = './data/users.json'

userRouter.get('/', async (req, res) => {
    try {
        const users = await read(USERS_DATA)
        return res.status(200).send(users)
    } catch (err) {
        res.json({ eror: err })
    }
})

userRouter.get('/:username', async (req, res) => {
    try {
        const username = req.params.username
        const users = await read(USERS_DATA)
        let search = users.filter((user) => user.username === username)
        if (search.length === 0) {
            return res.json({ message: 'this user name not exist' })
        }
        return res.send(search)
    } catch (err) {
        return res.json({ error: err })
    }
})


userRouter.put('/:username', async (req, res) => {
    try {
        const users = await read(USERS_DATA)
        const username = req.params.username
        const newObj = req.body
        let pass = String(newObj.password)
        newObj.password = pass
        if (newObj.username) {
            return res.send({ msg: "you cant change username" })
        }
        users.forEach(user => {
            if (user.username === username) {
                user.password = newObj.password
            }

        });
        await write(USERS_DATA, users)
        res.json({ msg: "update successfully" })
    } catch (err) {
        return res.json({ error: err })
    }
})


userRouter.post('/register', async (req, res) => {
    try {
        const newUser = req.body
        const newUserKey = Object.keys(newUser)
        const users = await read(USERS_DATA)
        if (newUserKey.length !== 2) {
            return res.json({ error: "invalid input you need enter only 2 keys" })
        }
        if (typeof newUser !== "object") {
            return res.json({ message: "you need enter an object" })
        }
        let checkName = users.filter((user) => user.username === newUser.username)
        if (checkName.length > 0) {
            return res.json({ message: "this name already exist!" })
        }
        if (!newUserKey.includes("username") || !newUserKey.includes("password")) {
            return res.json({ error: "you need enter only a username and password keys" })
        }
        let pass = String(newUser.password)
        newUser.password = pass
        users.push(newUser)
        await write(USERS_DATA, users)
        return res.status(200).json({ message: "User registered successfully" })
    } catch (err) {
        return res.json({ error: err })
    }
})

userRouter.delete('/:username', async(req, res)=>{
    try{
        const users = await read(USERS_DATA)
        const username = req.params.username
        const index = users.findIndex((user)=>{if(user.username === username)return true})
        users.splice(index,1)
        res.json({message:"user deleted"})
        await write(USERS_DATA, users)
    }catch(err){
        res.json({error:err})
    }
})



export default userRouter