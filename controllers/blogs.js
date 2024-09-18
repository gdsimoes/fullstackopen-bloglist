const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
    const blogs = Blog.find({});
    res.json(blogs);
});

blogsRouter.post("/", (req, res) => {
    const blog = new Blog(req.body);

    blog.save().then((result) => {
        res.status(201).json(result);
    });
});

module.exports = blogsRouter;
