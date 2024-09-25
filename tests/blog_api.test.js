const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");

const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

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

    assert.ok(
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

test("a blog without title or url properties responds with status code 400", async () => {
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

test("a blog can be deleted", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[1];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

    assert.ok(blogsAtEnd.every((blog) => blog.id !== blogToDelete.id));
});

test("the likes property can be updated", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[2];

    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const blogOnDb = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);

    assert.strictEqual(blogOnDb.likes, updatedBlog.likes);
});

describe("when there is initially one user in db", () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash("sekret", 10);
        const user = new User({ username: "root", passwordHash });

        await user.save();
    });

    test("creation succeeds with a fresh username", async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: "mluukkai",
            name: "Matti Luukkainen",
            password: "salainen",
        };

        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

        const usernames = usersAtEnd.map((u) => u.username);
        assert(usernames.includes(newUser.username));
    });

    test("creation fails with invalid username", async () => {
        const noUsernameUser = {
            name: "Guilherme Dias Simões",
            password: "123456",
        };

        const noUsernameUserResponse = await api
            .post("/api/users")
            .send(noUsernameUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        assert(noUsernameUserResponse.body.error.includes("Path `username` is required"));

        const invalidUsernameUser = {
            username: "gd",
            name: "Guilherme Dias Simões",
            password: "123456",
        };

        const invalidUsernameUserResponse = await api
            .post("/api/users")
            .send(invalidUsernameUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        assert(invalidUsernameUserResponse.body.error.includes("is shorter than the minimum allowed length (3)"));
    });

    test("creation fails with invalid password", async () => {
        const noPasswordUser = {
            username: "gdsimoes",
            name: "Guilherme Dias Simões",
        };

        const noPasswordUserResponse = await api
            .post("/api/users")
            .send(noPasswordUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        assert(noPasswordUserResponse.body.error.includes("Password must be a string"));

        const invalidPasswordUser = {
            username: "gdsimoes",
            name: "Guilherme Dias Simões",
            password: "12",
        };

        const invalidPasswordUserResponse = await api
            .post("/api/users")
            .send(invalidPasswordUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        assert(invalidPasswordUserResponse.body.error.includes("Password must be at least 3 characters"));
    });

    test("creation fails with proper statuscode and message if username already taken", async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: "root",
            name: "Superuser",
            password: "salainen",
        };

        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert(result.body.error.includes("expected `username` to be unique"));

        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    });
});

after(async () => {
    await mongoose.connection.close();
});
