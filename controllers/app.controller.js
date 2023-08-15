const { readTopics, fetchArticles, fetchArticlesbyId } = require('../models/app.model')
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

const getArticlesById = (request, response, next) => {
    const { article_id } = request.params
    fetchArticlesbyId(article_id)
    .then((article) => {
        response.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

const getArticles = (request, response) => {
    fetchArticles()
    .then((allArticles) => {
        response.status(200).send({allArticles})
    })
}


module.exports = { getEndpoints, getTopics, getArticles, getArticlesById }