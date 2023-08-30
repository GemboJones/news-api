const { readTopics, fetchArticles, fetchArticlesbyId, fetchCommentsByArticleId, insertArticleComment, updateArticleVotes, removeCommentById, fetchUsers } = require('../models/app.model')
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

const postArticleComment = (request, response, next) => {

    const commentToAdd = request.body
    const {article_id} = request.params

    insertArticleComment(commentToAdd, article_id)
    .then((commentAdded) => {
        response.status(201).send({commentAdded})
    })
    .catch((err) => {
        next(err)
    })
}

const patchArticleVotes = (request, response, next) => {
    const {inc_votes} = request.body
    const {article_id} = request.params

    updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
        response.status(200).send({updatedArticle})
    })
    .catch((err) => {
        next(err)
    })
}

const deleteCommentById = (request, response, next) => {
    const {comment_id} = request.params
    removeCommentById(comment_id)
    .then(() => {
        response.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}

const getUsers = (request, response, next) => {
    fetchUsers()
    .then((allUsers) => {
        response.status(200).send({allUsers})
    })
}


module.exports = { getEndpoints, getTopics, getArticles, getArticlesById, getCommentsByArticleId, postArticleComment, patchArticleVotes, deleteCommentById, getUsers }
