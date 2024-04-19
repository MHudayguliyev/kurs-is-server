const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const {Server} = require("socket.io")

app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', 
        methods: ['GET', 'POST']
    }
})

io.on('connection', socket => {
    console.log("socket id", socket.id)

    socket.on('join-room', room => {
        socket.join(room)
        console.log(`Client with ${socket.id} connected the room: ${room}.`)
    })

    socket.on('send', message => {
        console.log('message', message)
        socket.to(message.room).emit('receive', message)
    })

    socket.on('typing', data => {
        console.log('data', data)
        socket.to(data.room).emit('status', data)
    })

    socket.on('disconnect', () => console.log('Client disconnected', socket.id))
})

const PORT = 8080 
server.listen(PORT, () => console.log(`App run on port ${PORT}`))