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
    return db.query(`SELECT articles.article_id, comment_id, comments.votes, comments.created_at, comments.author, comments.article_id 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1`, [article_id])
    // fetchArticlesbyId(article_id)
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'not found' })
        } else {
            return db.query(`SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id 
            FROM articles
            LEFT JOIN comments ON articles.article_id = comments.article_id
            WHERE comments.article_id = $1
            ORDER BY created_at DESC;`, [article_id])
            .then(({rows}) => {           
                return rows
            })
        }
    })     
}

module.exports = { readTopics, fetchArticlesbyId, fetchArticles, fetchCommentsByArticleId }


/* const fetchCommentsByArticleId = (article_id) => {
    const checkArticleIdExists = db.query(
        'SELECT * FROM comments WHERE article_id = $1;', [article_id]);
console.log(checkArticleIdExists, '<<< in model')
        if (checkArticleIdExists.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'not found' })
        } else {


    return db.query(`SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE comments.article_id = $1
    ORDER BY created_at DESC;`, [article_id])
    .then(({rows}) => {
        console.log(rows, '<<< in model')  
        return rows
    })
}
}
    
    */
