import express from 'express'
import { read, write } from '../utils/functions.js'

const eventRouter = express()
const EVENTS_DATA = './data/events.json'
const USERS_DATA = './data/users.json'


eventRouter.get('/', async (req, res) => {
    try {
        const events = await read(EVENTS_DATA)
        return res.status(200).send(events)
    } catch (err) {
        res.json({ eror: err })
    }
})

eventRouter.get('/:eventname', async (req, res) => {
    try {
        const eventname = req.params.eventname
        const events = await read(EVENTS_DATA)
        let search = events.filter((event) => event.eventname === eventname)
        if (search.length === 0) {
            return res.json({ message: 'this eventname not exist' })
        }
        return res.send(search)
    } catch (err) {
        return res.json({ error: err })
    }
})

eventRouter.put('/:eventname', async (req, res) => {
    try {
        const events = await read(EVENTS_DATA)
        const users = await read(USERS_DATA)
        const eventname = req.params.eventname
        const newObj = req.body
        let newObjKeys = Object.keys(newObj)
        if (newObjKeys.includes("eventname")) {
            return res.send({ msg: "you cant change eventname" })
        }
        if(newObjKeys.includes("ticketsForSale")){
            let tickets = Number(newObj.ticketsForSale)
            newObj.ticketsForSale = tickets 
        }
        if(newObjKeys.includes("username")){
        let user = users.filter((user)=> user.name=== newObj.username && user.password === newObj.password)
        if(user.length === 0){
            return res.json({msg:"this username not exist"})
        }}
        if (newObjKeys.includes("password")){
            let pass = String(newObj.password)
            newObj.password = pass 
        }
         events.forEach(element => {
            if (element.eventname === eventname) {
                for (let key in newObj) {
                    element[key] = newObj[key]
                }
            }

        });
        await write (EVENTS_DATA, events)
        res.json({message:"update successfully"})

    } catch (err) {
        return res.json({ error: err })
    }
})


eventRouter.post('/creator', async(req, res)=>{
    try{
        const newEvent = req.body
        const events = await read(EVENTS_DATA)
        const users = await read(USERS_DATA)
        let allowKeys = ["eventname","ticketsforsale","username","password"]
        let check = users.filter((user)=> user.username === newEvent.username && user.password == newEvent.password)
        if(check.length == 0){
            return res.json({message:"this user name and password not exist"})
        }
         let checkEventName = events.filter((event) => event.eventname === newEvent.eventname)
        if (checkEventName.length > 0) {
            return res.json({ message: "this eventname already exist!" })}
        for(let key of allowKeys){
            if (!(key in newEvent)){
                return res.json({error:`you must have ${key} key in your object`})
            }
        }
        events.push(newEvent)
        await write(EVENTS_DATA, events)
        res.json({message:"Event created successfully"})
    }
    catch(err){
        res.json({error:err})
    }
})

eventRouter.delete('/:eventname', async(req, res)=>{
    try{
        const events = await read(EVENTS_DATA)
        const eventName = req.params.eventname
        const index = events.findIndex((event)=>{if(event.eventname === eventName)return true})
         events.splice(index,1)
         res.json({message:"event deleted"})
         await write(EVENTS_DATA, events)
     }catch(err){
         res.json({error:err})
     }
 })





export default eventRouter