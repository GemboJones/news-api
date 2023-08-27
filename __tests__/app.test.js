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
                expect(article).toHaveProperty('comment_count', expect.any(String))
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








































































































































    
    describe('POST /api/articles/:article_id/comments', () => {
        test('201 : Request body accepts an object with the following properties; username and body, and responds with the posted comment.', () => {

            const newComment = {
                username: 'butter_bridge',
                body: "comment comment comment"
              }
            return request(app)
            .post('/api/articles/5/comments')
            .send(newComment)
            .expect(201)
            .then((response) => {
                const {commentAdded} = response.body
                expect(commentAdded).toEqual({
                    body: "comment comment comment"
                })
            })            
        })

        test('201 : Request body accepts an object with unnecessary properties but still adds a comment if the correct properties are present as well, and responds with the posted comment.', () => {

            const newComment = {
                username: 'butter_bridge',
                age: 54,
                body: "comment comment"
              }
            return request(app)
            .post('/api/articles/5/comments')
            .send(newComment)
            .expect(201)
            .then((response) => {
                const {commentAdded} = response.body
                expect(commentAdded).toEqual({
                    body: "comment comment"
                })
            })            
        })

        test('404 : responds with a 404 message when the author (username) is valid but does not exist.', () => {

            const newComment = {
                username: 'peter_file',
                body: "comment comment comment, so many comments"
              }
            return request(app)
            .post('/api/articles/5/comments')
            .send(newComment)
            .expect(404)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('not found')
            })            
        })
        test('404 : responds with a 404 message when the article_id is valid but does not exist', () => {

            const newComment = {
                username: 'icellusedkars',
                body: "comment comment comment, so many comments"
              }
            return request(app)
            .post('/api/articles/999/comments')
            .send(newComment)
            .expect(404)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('not found')
            })                  
        })
        test('400 : responds with a 400 message when the article_id is invalid', () => {

            const newComment = {
                username: 'icellusedkars',
                body: "comment comment comment, so many comments"
              }
            return request(app)
            .post('/api/articles/hi/comments')
            .send(newComment)
            .expect(400)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('bad request')
            })                  
        })
        test('400 : responds with a 400 message when the request body is missing required field(s), e.g. no username or body properties', () => {

            const newComment = {}
            return request(app)
            .post('/api/articles/5/comments')
            .send(newComment)
            .expect(400)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('bad request')
            })                  
        })
    })
})