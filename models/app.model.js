const db = require('../db/connection')

const readTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({rows}) => {
        return rows
    })
}

const fetchArticlesbyId = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'not found' })
        } else {
            return rows[0]
        }        
    })
}

const fetchArticles = () => {

    return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id
    ORDER BY created_at DESC`)
    .then(({rows}) => {
        return rows
    })
}

const fetchCommentsByArticleId = (article_id) => {
    return fetchArticlesbyId(article_id).then(() => {
            return db.query(`SELECT comment_id, votes, created_at, author, body, article_id 
            FROM comments
            WHERE article_id = $1
            ORDER BY created_at DESC;`, [article_id])
            .then(({rows}) => {           
                return rows
            })
    })     
}

module.exports = { readTopics, fetchArticlesbyId, fetchArticles, fetchCommentsByArticleId }

