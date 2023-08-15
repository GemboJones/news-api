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
        test('200 : responds an object describing all the available endpoints on your API', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then((response) => {
                const { allEndpoints } = response.body
                expect(allEndpoints).toEqual(endpointsFile)                
            })            
        })
    })
})