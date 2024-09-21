const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
    const blog = new Blog({ likes: 0, ...req.body });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

blogsRouter.put("/:id", async (req, res) => {
    const { title, url, author, likes } = req.body;

    const blog = {
        title,
        url,
        author,
        likes,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
    res.json(updatedBlog);
});

module.exports = blogsRouter;
