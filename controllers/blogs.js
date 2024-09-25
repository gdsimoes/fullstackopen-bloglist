const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (req, res) => {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
    res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
    const user = await User.findOne();
    const blog = new Blog({ likes: 0, ...req.body, user: user.id });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

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
