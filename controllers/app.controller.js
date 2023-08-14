const {readTopics} = require('../models/app.model')

const getTopics = (request, response, next) => {
    readTopics()
    .then((topics) => {
        response.status(200).send({topics})
    })
}


module.exports = {getTopics}