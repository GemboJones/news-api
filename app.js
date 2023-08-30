const express = require('express')
const { getEndpoints, getTopics, getArticles, getArticlesById, getCommentsByArticleId, postArticleComment, patchArticleVotes, deleteCommentById } = require('./controllers/app.controller')

const app = express()
app.use(express.json())


app.get('/api', getEndpoints)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticlesById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postArticleComment)

app.patch('/api/articles/:article_id', patchArticleVotes)

app.delete('/api/comments/:comment_id', deleteCommentById)


app.use((err, request, response, next) => {
    if (err.status && err.msg) {
        response.status(err.status).send({ msg: err.msg });
    } else {
        next(err)
    }
})

app.use((err, request, response, next) => {
    if (err.code === '23503') {
        response.status(404).send({msg: 'not found'})
    } else {
        next(err)
    }
})

app.use((err, request, response, next) => {
    if (err.code === '22P02' || err.code === '23502') {
        response.status(400).send({msg: 'bad request'})
    } else {
        next(err)
    }
})

app.use((_, response) => {
    response.status(404).send({ msg: 'not found'})
})

app.use((err, request, response, next) => {
    response.status(500).send({msg: 'internal server error'})
})

module.exports = app