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
                const { articles } = response.body
                expect(articles).toBeInstanceOf(Array)
                expect(articles).toHaveLength(13)
                articles.forEach((article) => {
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
                const { articles } = response.body
                expect(articles).toBeSortedBy('created_at', { descending: true,})
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
    describe('POST /api/articles/:article_id/comments', () => {
        test('201 : Request body accepts an object with the properties username and body, and responds with the posted comment.', () => {

            const newComment = {
                username: 'butter_bridge',
                body: 'comment comment comment'
              }
            return request(app)
            .post('/api/articles/5/comments')
            .send(newComment)
            .expect(201)
            .then((response) => {
                const {commentAdded} = response.body
                expect(commentAdded).toEqual({
                  article_id: 5,
                  author: "butter_bridge",
                  body: "comment comment comment",
                });
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
                  article_id: 5,
                  author: "butter_bridge",
                  body: "comment comment",
                });
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
        test('400 : responds with a 400 message when the request body is missing required data, e.g. no username or body properties', () => {

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
    describe('PATCH /api/articles/:article_id', () => {
        test('200 : Request body accepts an object with a key-value pair where the value is a number that increases or decreases the articles vote property, and responds with the updated article.', () => {

            const updateArticleVotes = { inc_votes: 20 }
            return request(app)
            .patch('/api/articles/1')
            .send(updateArticleVotes)
            .expect(200)
            .then((response) => {
                const {updatedArticle} = response.body
                expect(updatedArticle).toHaveProperty('article_id')
                expect(updatedArticle).toHaveProperty('title')
                expect(updatedArticle).toHaveProperty('topic')
                expect(updatedArticle).toHaveProperty('author')
                expect(updatedArticle).toHaveProperty('body')
                expect(updatedArticle).toHaveProperty('created_at')
                expect(updatedArticle).toHaveProperty('votes')
                expect(updatedArticle).toHaveProperty('article_img_url')
                expect(updatedArticle.votes).toEqual(120)
            })            
        })
        test('200 : Request body accepts an object with unnecessary properties, but still increases or decreases the articles vote property if the correct key-value pair property is present, and responds with the updated article.', () => {

            const updateArticleVotes = {
                inc_votes: 35,
                username: 'butter_bridge',
                body: "comment comment"
              }

            return request(app)
            .patch('/api/articles/3')
            .send(updateArticleVotes)
            .expect(200)
            .then((response) => {
                const {updatedArticle} = response.body
                expect(updatedArticle).toHaveProperty('article_id')
                expect(updatedArticle).toHaveProperty('title')
                expect(updatedArticle).toHaveProperty('topic')
                expect(updatedArticle).toHaveProperty('author')
                expect(updatedArticle).toHaveProperty('body')
                expect(updatedArticle).toHaveProperty('created_at')
                expect(updatedArticle).toHaveProperty('votes')
                expect(updatedArticle).toHaveProperty('article_img_url')
                expect(updatedArticle.votes).toEqual(35)
            })           
        })
        test('200 : should never return a votes property value less than 0.', () => {

            const updateArticleVotes = { inc_votes: -120 }
            return request(app)
            .patch('/api/articles/1')
            .send(updateArticleVotes)
            .expect(200)
            .then((response) => {
                const {updatedArticle} = response.body
                expect(updatedArticle.votes).toEqual(0)
            })            
        })
        test('404 : responds with a 404 message when the article_id is valid but does not exist', () => {
            const updateArticleVotes = { inc_votes: 20 }
            return request(app)
            .patch('/api/articles/999')
            .send(updateArticleVotes)
            .expect(404)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('not found')
            })           
        })
        test('400 : responds with a 400 message when the article_id is invalid', () => {
            const updateArticleVotes = { inc_votes: 20 }
            return request(app)
            .patch('/api/articles/notAnId')
            .send(updateArticleVotes)
            .expect(400)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('bad request')
            })            
        })
        test('400 : responds with a 400 message when the vote property value is invalid (not a number).', () => {

            const updateArticleVotes = { inc_votes: 'notANum' }
            return request(app)
            .patch('/api/articles/1')
            .send(updateArticleVotes)
            .expect(400)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('bad request')
            })                   
        })
        test('400 : responds with a 400 message when the request body is missing the required property (body is empty).', () => {

            const updateArticleVotes = {}
            return request(app)
            .patch('/api/articles/1')
            .send(updateArticleVotes)
            .expect(400)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('bad request')
            })      
        })
    })
    describe('DELETE /api/comments/:comment_id', () => {
        test('204 : should delete the given comment by comment_id.', () => {

            return request(app)
            .delete('/api/comments/1')
            .expect(204)         
        })
        test('404 : responds with a 404 message when the comment_id is valid but does not exist', () => {

            return request(app)
            .delete('/api/comments/999')
            .expect(404)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('not found')
            })                  
        })
        test('400 : responds with a 400 message when the comment_id is invalid', () => {

            return request(app)
            .delete('/api/comments/hi')
            .expect(400)
            .then((response) => {
                const { msg } = response.body
                expect(msg).toBe('bad request')
            })                  
        })
    })
    describe('GET /api/users', () => {
        test('200 : responds with an array of objects, each object containing the following properties: username, name, avatar_url', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                const {allUsers} = response.body
                expect(allUsers).toBeInstanceOf(Array)
                allUsers.forEach((user) => {
                    expect(user).toHaveProperty('username', expect.any(String))
                    expect(user).toHaveProperty('name', expect.any(String))
                    expect(user).toHaveProperty('avatar_url', expect.any(String))
                })
            })
        })
    })
    describe("GET /api/articles (topic query)", () => {
      test("200 : Should filter articles by a topic given in a query.", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then((response) => {
            const { articles } = response.body;
             articles.forEach((article) => {
               expect(article.topic).toBe("cats");
               expect(article).toHaveProperty("article_id", expect.any(Number));
               expect(article).toHaveProperty("title", expect.any(String));
               expect(article).toHaveProperty("topic", expect.any(String));
               expect(article).toHaveProperty("author", expect.any(String));
               expect(article).toHaveProperty("created_at", expect.any(String));
               expect(article).toHaveProperty("votes", expect.any(Number));
               expect(article).toHaveProperty("article_img_url", expect.any(String));
               expect(article).not.toHaveProperty("body");
               expect(article).toHaveProperty("comment_count", expect.any(Number));
             });
          });
      });
    });
    describe("GET /api/articles/:article_id (including comment_count)", () => {
      test("200 : gets an article by its id and responds with an object containing all properties with the addition of comment_count", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then((response) => {
            const { article } = response.body;
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("body");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count", expect.any(Number));
          });
      });
    });
})