const { readTopics, readArticles } = require('../models/app.model')
const allEndpoints = require('../endpoints.json')


const getEndpoints = (request, response) => {
    response.status(200).send({allEndpoints})
}

const getTopics = (request, response) => {
    readTopics()
    .then((topics) => {
        response.status(200).send({topics})
    })
}

const getArticles = (request, response, next) => {
    const { article_id } = request.params
    readArticles(article_id)
    .then((article) => {
        response.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getEndpoints, getTopics, getArticles }