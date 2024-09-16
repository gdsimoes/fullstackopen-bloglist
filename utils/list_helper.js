// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
    return 1;
};

function totalLikes(blogs) {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

function favoriteBlog(blogs) {
    if (blogs.length === 0) {
        return null;
    }

    const result = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0]);

    delete result._id;
    delete result.url;
    delete result.__v;

    return result;
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
};
