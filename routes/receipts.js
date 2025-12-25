import express from 'express'
import { read, write } from '../utils/functions.js'

const ticketRouter = express()
const EVENTS_DATA = './data/events.json'
const USERS_DATA = './data/users.json'
const RECEIPTS_DATA = './data/receipts.json'


ticketRouter.get('/', async (req, res) => {
    try {
        const receipts = await read(RECEIPTS_DATA)
        return res.status(200).send(receipts)
    } catch (err) {
        res.json({ eror: err })
    }
})


ticketRouter.get('/:eventname', async (req, res) => {
    try {
        const eventname = req.params.eventname
        const receipts = await read(RECEIPTS_DATA)
        let search = receipts.filter((receipt) => receipt.eventname === eventname)
        if (search.length === 0) {
            return res.json({ message: 'this eventname not exist' })
        }
        return res.send(search)
    } catch (err) {
        return res.json({ error: err })
    }
})


ticketRouter.put('/:eventname', async (req, res) => {
    try {
        const receipts = await read(RECEIPTS_DATA)
        const users = await read(USERS_DATA)
        const eventname = req.params.eventname
        const newObj = req.body
        let newObjKeys = Object.keys(newObj)
        if (newObjKeys.includes("eventname")) {
            return res.send({ msg: "you cant change eventname" })
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
        receipts.forEach(receipt => {
            if (receipt.eventname === eventname) {
                for (let key in newObj) {
                    receipt[key] = receipt[key]
                }
            }

        });
        await write (RECEIPTS_DATA, receipts)
        res.json({message:"update successfully"})

    } catch (err) {
        return res.json({ error: err })
    }
})

ticketRouter.post('/buy', async(req, res)=>{
    try{
        const receipts = await read(RECEIPTS_DATA)
        const events = await read(EVENTS_DATA) 
        const newObj = req.body
        let allowKeys = ["eventname","quantity","username","password"]
        let check = events.filter((event)=> event.username === newObj.username)
        if(check.length == 0){
            return res.json({message:"this event name and password not exist"})
        }
        for(let key of allowKeys){
            if (!(key in newObj)){
                return res.json({error:`you must have ${key} key in your object`})
            }
        }
        events.forEach(element => {
            console.log(element);
            if (element.eventname === newObj.eventname) {
                if(newObj.quantity > element.ticketsforsale){
                    return res.send("not enough tickets")
                }

                element.ticketsforsale -= newObj.quantity
            }
            
            
        });
        receipts.push(newObj)
        await write(RECEIPTS_DATA,receipts)
        await write(EVENTS_DATA,events)
    }
    catch(err){
        res.json({error:err})
    }
})




ticketRouter.delete('/:eventname', async(req, res)=>{
    try{
        const receipts = await read(RECEIPTS_DATA)
        const eventName = req.params.eventname
        const index = receipts.findIndex((event)=>{if(event.eventname === eventName)return true})
         receipts.splice(index,1)
         res.json({message:"event deleted"})
         await write(RECEIPTS_DATA,receipts)
     }catch(err){
         res.json({error:err})
     }
 })





export default ticketRouter