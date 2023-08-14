const express = require('express')
const {getTopics} = require('./controllers/app.controller')

const app = express()

app.get('/api/topics', getTopics)

app.use((err, request, response, next) => {
    response.status(500).send({msg: 'internal server error'})
})

module.exports = app