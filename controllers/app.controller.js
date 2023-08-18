const { readTopics, fetchArticles, fetchArticlesbyId, fetchCommentsByArticleId } = require('../models/app.model')
const allEndpoints = require('../endpoints.json')


const getEndpoints = (request, response) => {
    response.status(200).send({allEndpoints})
}

const getTopics = (request, response) => {
    readTopics()
    .then((topics) => {
        response.status(200).send({topics})
    })
    .catch((err) => {
        next(err)
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
    .catch((err) => {
        next(err)
    })
}

const getCommentsByArticleId = (request, response, next) => {
    const article_id = request.params.article_id
    fetchCommentsByArticleId(article_id)
    .then((comments) => {
        response.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getEndpoints, getTopics, getArticles, getArticlesById, getCommentsByArticleId, getCommentsByArticleId }