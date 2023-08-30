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

const insertArticleComment = (commentToAdd, article_id) => {
    const {username, body} = commentToAdd

    return fetchArticlesbyId(article_id).then(() => {
        return db.query(`INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING body`, [username, body, article_id])
        .then(({rows}) => {
            return rows[0]
        })
    })    
}

const updateArticleVotes = (article_id, inc_votes) => {

    return fetchArticlesbyId(article_id)
    .then((article) => {        
        const currentVotes = article.votes
        let newVotes = currentVotes + inc_votes
        if (currentVotes + inc_votes < 0) {newVotes = 0}

        return db.query(`UPDATE articles 
        SET votes = $1 
        WHERE article_id = $2 
        RETURNING *`, [newVotes, article_id])
        .then(({rows}) => {
            return rows[0]
        })
    })
}

const removeCommentById = (comment_id) => {

    return db.query(`DELETE FROM comments 
    WHERE comment_id = $1
    RETURNING *`, [comment_id])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'not found' })
        } else {
            return rows[0]
        }
    })
}


module.exports = { readTopics, fetchArticlesbyId, fetchArticles, fetchCommentsByArticleId, insertArticleComment, updateArticleVotes, removeCommentById }