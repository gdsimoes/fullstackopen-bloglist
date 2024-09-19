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

function mostBlogs(blogs) {
    if (blogs.length === 0) {
        return null;
    }

    const authors = new Map();

    for (const { author } of blogs) {
        authors.set(author, (authors.get(author) ?? 0) + 1);
    }

    let result = { blogs: -Infinity };
    for (const [author, blogs] of authors) {
        if (result.blogs < blogs) {
            result = { author, blogs };
        }
    }

    return result;
}

function mostLikes(blogs) {
    if (blogs.length === 0) {
        return null;
    }

    const authors = new Map();

    for (const { author, likes } of blogs) {
        authors.set(author, (authors.get(author) ?? 0) + likes);
    }

    let result = { likes: -Infinity };
    for (const [author, likes] of authors) {
        if (result.likes < likes) {
            result = { author, likes };
        }
    }

    return result;
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
};
