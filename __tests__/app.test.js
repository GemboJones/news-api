const app = require('../app.js')
const request = require('supertest');
const endpointsFile = require('../endpoints.json')
const connection = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data/index.js')



afterAll(() => {
    return connection.end()
})

beforeEach(() => {
    return seed(data)
})

describe('app', () => {
    describe('404: invalid endpoint', () => {
        test('404 : responds with a 404 message when the path is valid but does not exist', () => {
            return request(app)
            .get('/api/notARoute')
            .expect(404)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('not found')
            })           
        })
    })
    describe('GET /api/topics', () => {
        test('200 : responds with a status of 200', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
        })
        test('200 : responds with an array of topics', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                const {topics} = response.body
                expect(topics).toBeInstanceOf(Array)
                expect(topics).toHaveLength(3)
                topics.forEach((topic) => {
                    expect(topic).toHaveProperty('description', expect.any(String))
                    expect(topic).toHaveProperty('slug', expect.any(String))
                })
            })
        })
    })
    describe('GET /api', () => {
        test('200 : responds with an object describing all the available endpoints on your API', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then((response) => {
                const { allEndpoints } = response.body
                expect(allEndpoints).toEqual(endpointsFile)                
            })            
        })
    })
    describe('GET /api/articles/:article_id', () => {
        test('200 : gets an article by its id and responds with an object containing properties; author, title, article_id, body, topic, created_at, votes, article_img_url', () => {
            return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then((response) => {
                const {article} = response.body
                expect(article).toHaveProperty('article_id')
                expect(article).toHaveProperty('title')
                expect(article).toHaveProperty('topic')
                expect(article).toHaveProperty('author')
                expect(article).toHaveProperty('body')
                expect(article).toHaveProperty('created_at')
                expect(article).toHaveProperty('votes')
                expect(article).toHaveProperty('article_img_url')
            })           
        })
        test('400 : responds with a 400 message when the article_id is invalid', () => {
            return request(app)
            .get('/api/articles/notAnId')
            .expect(400)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('bad request')
            })           
        })
        test('404 : responds with a 404 message when the article_id is valid but does not exist', () => {
            return request(app)
            .get('/api/articles/999')
            .expect(404)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('not found')
            })           
        })
    })
    describe('GET /api/articles', () => {
        test('200 : responds with an articles array of article objects containing properties; author, title, article_id, topic, created_at, votes, article_img_url, comment_count, which is the total number of comments for each article (and not body property)', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const { allArticles } = response.body
                expect(allArticles).toBeInstanceOf(Array)
                expect(allArticles).toHaveLength(13)
                allArticles.forEach((article) => {
                expect(article).toHaveProperty('article_id', expect.any(Number))
                expect(article).toHaveProperty('title', expect.any(String))
                expect(article).toHaveProperty('topic', expect.any(String))
                expect(article).toHaveProperty('author', expect.any(String))
                expect(article).toHaveProperty('created_at', expect.any(String))
                expect(article).toHaveProperty('votes', expect.any(Number))
                expect(article).toHaveProperty('article_img_url', expect.any(String))
                expect(article).not.toHaveProperty('body')
                expect(article).toHaveProperty('comment_count', expect.any(Number))
                })
            })            
        })
        test('200 : the articles should be sorted by date in descending order.', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const { allArticles } = response.body
                expect(allArticles).toBeSortedBy('created_at', { descending: true,})
            })  
        })
    })
    describe('GET /api/articles/:article_id/comments', () => {
        test('200 : responds with an array of comments for the given article_id of which each comment should have the following properties; comment_id, votes, created_at, author, body, article_id', () => {
            return request(app)
            .get('/api/articles/5/comments')
            .expect(200)
            .then((response) => {
                const { comments } = response.body 
                expect(comments).toBeInstanceOf(Array)
                expect(comments).toHaveLength(2);

                comments.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id', expect.any(Number))
                expect(comment).toHaveProperty('votes', expect.any(Number))
                expect(comment).toHaveProperty('created_at', expect.any(String))
                expect(comment).toHaveProperty('author', expect.any(String))
                expect(comment).toHaveProperty('body', expect.any(String))
                expect(comment).toHaveProperty('article_id', expect.any(Number))
                })
            })           
        })
        test('200 : the articles should be sorted by date with the most recent first.', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then((response) => {
                const { comments } = response.body
                expect(comments).toBeSortedBy('created_at', { descending: true,})
            })  
        })
        test('200 : responds with an empty array if the article_id exists but there are no comments for that article_id', () => {
            return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then((response) => {
                const { comments } = response.body
                expect(comments).toBeInstanceOf(Array)
                expect(comments).toHaveLength(0)

                const { msg } = response.body
                expect(msg).not.toBe('not found')
            })           
        })
        test('404 : responds with a 404 message when the path is valid but the article_id does not exist', () => {
            return request(app)
            .get('/api/articles/52/comments')
            .expect(404)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('not found')
            })           
        })
        test('400 : responds with a 400 message when the article_id is invalid', () => {
            return request(app)
            .get('/api/articles/hi/comments')
            .expect(400)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('bad request')
            })           
        })
    })
})