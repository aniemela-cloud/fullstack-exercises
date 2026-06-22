const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)
const blogs_testdata = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    //console.log('cleared database')
    const blogMongoObjList = blogs_testdata.map(blog => new Blog(blog))
    const promiseArray = blogMongoObjList.map(blogObj => blogObj.save())
    await Promise.all(promiseArray)
    //console.log('data re-insterted')
})
describe('api/blogs GET endpoint', () => {
    test('blog posts are returned as JSON', async () => {
    await api
    .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    test('the number of blog posts returned matches number added to database', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, blogs_testdata.length)
    })
    test("unique identifier of blog posts is named 'id'", async () => {
        const response = await api.get('/api/blogs')
        assert.ok(response.body[0].id, "First result does not have a non-false 'id' field")
        const byIdResponse = await api.get(`/api/blogs/${response.body[0].id}`)
        assert.strictEqual(byIdResponse.body.id, response.body[0].id, 
            "Searching by 'id' of the first found result did not give result with same 'id'")
    })
})
describe('api/blogs POST endpoint', () => {
    test('POST without author fails with status 400', async () => {
        const post_no_author = {
            title: "Authorless Post",
            url: "http://example.url.com/foo/bar",
        }
        await api
            .post('/api/blogs')
            .send(post_no_author)
            .expect(400)
    })

    test('POST without title fails with status 400', async () => {
        const post_no_title = {
            author: "Author Notitle",
            url: "http://example.url.com/foo/bar",
        }
        await api
            .post('/api/blogs')
            .send(post_no_title)
            .expect(400)
    })

    test('POST without URL fails with status 400', async () => {
        const post_no_url = {
            title: "Post With No Url",
            author: "Example Author",
        }  
        await api
            .post('/api/blogs')
            .send(post_no_url)
            .expect(400)
    })

    test('POST with appropriate fields included returns 201', async () => {
        const post_good = {
            title: "Post With All Fields",
            author: "Example Author",
            url: "http://this.is.an.url.com/foo/bar",
            likes: 0
        }  
        await api
            .post('/api/blogs')
            .send(post_good)
            .expect(201)
        
    })
    test('succesful POST returns JSON', async () => {
        const post_good = {
            title: "Post With All Fields",
            author: "Example Author",
            url: "http://this.is.an.url.com/foo/bar",
            likes: 0
        }  
        await api
            .post('/api/blogs')
            .send(post_good)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    })
    test("Missing 'likes' field defaults to 0", async () => {
        const post_good = {
            title: "Post With All Fields",
            author: "Example Author",
            url: "http://this.is.an.url.com/foo/bar",
        }  
        const post_result = await api
            .post('/api/blogs')
            .send(post_good)
        assert.strictEqual(post_result.body.likes, 0)
    })

    test('succesful POST increases number of GET results by one', async () => {
        const post_good = {
            title: "Post With All Fields",
            author: "Example Author",
            url: "http://this.is.an.url.com/foo/bar",
            likes: 0
        }  
        const pre_results = await api.get('/api/blogs')
        await api
            .post('/api/blogs')
            .send(post_good)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const after_results = await api.get('/api/blogs')
        assert.strictEqual(after_results.body.length, pre_results.body.length+1)
    })
    test('JSON result from succesful POST matches sent data', async () => {
        const post_good = {
            title: "Post With All Fields",
            author: "Example Author",
            url: "http://this.is.an.url.com/foo/bar",
            likes: 0
        }  
        const post_result = await api
            .post('/api/blogs')
            .send(post_good)
        assert.partialDeepStrictEqual(post_result.body, post_good)
    })
    test('A result can be found using id read from JSON result of succesful POST', async () => {
        const post_good = {
            title: "Post With All Fields",
            author: "Example Author",
            url: "http://this.is.an.url.com/foo/bar",
            likes: 0
        }  
        const post_result = await api
            .post('/api/blogs')
            .send(post_good)
        
        const get_result = await api.get(`/api/blogs/${post_result.body.id}`)
        assert.partialDeepStrictEqual(post_result.body, get_result.body)
    })


})
after(async () => {
  await mongoose.connection.close()
})