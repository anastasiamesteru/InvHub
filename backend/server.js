import express from 'express'
import cors from 'cors'
import 'dotenv/config'

//app configuration

const app = express()
const port = process.env.port || 4000

//app middleware
app.use(express.json())
app.use(cors())

//api endpoints
app.get('/',(req, res)=> {
    res.send('API is working!')
})

app.listen(port, ()=>console.log("Server running on port ",port))