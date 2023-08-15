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
    describe('GET error handling', () => {
        test('404 : responds with an error when path does not exist', () => {
            return request(app)
            .get('/api/topicss')
            .expect(404)
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
        test('200 : responds with an articles array of article objects containing properties; author, title, article_id, topic, created_at, votes, article_img_url, comment_count (and not body)', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const { allArticles } = response.body
                expect(allArticles).toBeInstanceOf(Array)
                expect(allArticles).toHaveLength(13)
                allArticles.forEach((article) => {
                expect(article).toHaveProperty('article_id')
                expect(article).toHaveProperty('title')
                expect(article).toHaveProperty('topic')
                expect(article).toHaveProperty('author')
                expect(article).toHaveProperty('created_at')
                expect(article).toHaveProperty('votes')
                expect(article).toHaveProperty('article_img_url')
                expect(article).not.toHaveProperty('body')
                expect(article).toHaveProperty('comment_count')
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
        test('200 : comment_count property is the total count of all the comments with this article_id', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const { allArticles } = response.body
                expect(allArticles).toBeInstanceOf(Array)
                expect(allArticles).toHaveLength(13)
                expect(allArticles[0].comment_count).toBe('2')
                expect(allArticles[1].comment_count).toBe('1')
                expect(allArticles[2].comment_count).toBe('0')
                expect(allArticles[3].comment_count).toBe('0')
                expect(allArticles[4].comment_count).toBe('0')
                expect(allArticles[5].comment_count).toBe('2')
                expect(allArticles[6].comment_count).toBe('11')
                expect(allArticles[7].comment_count).toBe('2')
                expect(allArticles[8].comment_count).toBe('0')
                expect(allArticles[9].comment_count).toBe('0')
                expect(allArticles[10].comment_count).toBe('0')
                expect(allArticles[11].comment_count).toBe('0')
                expect(allArticles[12].comment_count).toBe('0')
            })  
        })
        test.skip('400 : responds with a 400 message when the path is invalid', () => {
            return request(app)
            .get('/api/22')
            .expect(400)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('bad request')
            })           
        })
        test.skip('404 : responds with a 404 message when the path is valid but does not exist', () => {
            return request(app)
            .get('/api/notARoute')
            .expect(404)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('not found')
            })           
        })
    })
})