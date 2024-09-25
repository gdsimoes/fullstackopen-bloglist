const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res) => {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
    res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
    const user = req.user;
    if (!user) {
        throw { name: "JsonWebTokenError", message: "token invalid" };
    }

    const blog = new Blog({ likes: 0, ...req.body, user: user.id });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    // If blog does not exist, return 204 to make the request idempotent
    if (!blog) {
        return res.status(204).end();
    }

    const user = req.user;

    if (!user) {
        throw { name: "JsonWebTokenError", message: "token invalid" };
    }

    if (blog.user.toString() !== user.id.toString()) {
        throw { name: "ForbiddenAccess", message: "user is not the creator of the blog" };
    }

    // Remove blog from user's blogs
    user.blogs = user.blogs.filter((id) => id.toString() !== blog.id.toString());
    await user.save();

    // Remove blog from database
    await blog.deleteOne();

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
