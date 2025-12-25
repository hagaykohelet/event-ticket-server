import express from 'express'
import userRouter from './routes/user.js';
import eventRouter from './routes/event.js'
import ticketRouter from './routes/receipts.js'


const app = express()
const PORT = 3000
app.use(express.json())
app.use('/user', userRouter)
app.use('/events', eventRouter)
app.use('/users/tickets',ticketRouter)











app.listen(PORT, () => {
    console.log("running server....")
})