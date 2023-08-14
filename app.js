const express = require('express')
const { getEndpoints, getTopics, getArticles } = require('./controllers/app.controller')
const { commentData } = require('./db/data/test-data')

const app = express()

app.get('/api', getEndpoints)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticles)

app.use((err, request, response, next) => {
    if (err.code === '22P02') {
        response.status(400).send({msg: 'bad request'})
    } else {
        next(err)
    }
})

app.use((err, request, response, next) => {
    if (err.status === 404) {
        response.status(404).send({msg: 'not found'})
    } else {
        next(err)
    }
})

app.use((err, request, response, next) => {
    response.status(500).send({msg: 'internal server error'})
})

module.exports = app