const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");

const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const { url } = require("node:inspector");

beforeEach(async () => {
    await Blog.deleteMany({});

    for (const blog of helper.initialBlogs) {
        const blogObject = new Blog(blog);
        await blogObject.save();
    }
});

test("blogs are returned as json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
});

test("blog posts have id and not _id", async () => {
    const response = await api.get("/api/blogs");

    assert.ok(response.body[0].id);
    assert.ok(!response.body[0]._id);
});

test("a valid blog can be added ", async () => {
    const newBlog = {
        title: "Física, Matemática e Outras Bobagens",
        author: "Guilherme Dias Simões",
        url: "https://gdsimoes.com",
        likes: 17,
    };

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    assert(
        blogsAtEnd.some(
            (blog) =>
                blog.title === newBlog.title &&
                blog.author === newBlog.author &&
                blog.url === newBlog.url &&
                blog.likes === newBlog.likes
        )
    );
});

test("a blog without likes property will have a default of 0", async () => {
    const newBlog = {
        title: "Física, Matemática e Outras Bobagens",
        author: "Guilherme Dias Simões",
        url: "https://gdsimoes.com",
    };

    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const blogOnDb = blogsAtEnd.find((blog) => blog.url === newBlog.url);

    assert.strictEqual(blogOnDb.likes, 0);
});

test("blog without title or url properties responds with status code 400", async () => {
    const blogWithoutTitle = {
        author: "Guilherme Dias Simões",
        url: "https://gdsimoes.com",
        likes: 17,
    };

    await api
        .post("/api/blogs")
        .send(blogWithoutTitle)
        .expect(400)
        .expect("Content-Type", /application\/json/);

    const blogWithoutUrl = {
        title: "Física, Matemática e Outras Bobagens",
        author: "Guilherme Dias Simões",
        likes: 17,
    };

    await api
        .post("/api/blogs")
        .send(blogWithoutUrl)
        .expect(400)
        .expect("Content-Type", /application\/json/);
});

after(async () => {
    await mongoose.connection.close();
});
