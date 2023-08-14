const app = require('../app.js')
const request = require('supertest');

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
        test('404 : responds with an error message when path does not exist', () => {
            return request(app)
            .get('/api/topicss')
            .expect(404)
        })
    })
})