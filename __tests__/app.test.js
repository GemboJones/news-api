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
})