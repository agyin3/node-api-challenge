const express = require('express')
const helmet = require('helmet')
const server = express()
const actionRouter = require('./routers/actionRouter')
const projectRouter = require('./routers/projectRouter')

server.use(express.json())
server.use(helmet())
server.use('/api/projects', projectRouter)
server.use('/api/actions', actionRouter)

server.get('/', (req, res) => {
    res.send(`<h1>Epstein Didn't Kill Himself</h1>`)
})

module.exports = server