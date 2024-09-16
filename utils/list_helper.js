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

// For testing
// const blogs = [
//     {
//         _id: "5a422a851b54a676234d17f7",
//         title: "React patterns",
//         author: "Michael Chan",
//         url: "https://reactpatterns.com/",
//         likes: 7,
//         __v: 0,
//     },
//     {
//         _id: "5a422aa71b54a676234d17f8",
//         title: "Go To Statement Considered Harmful",
//         author: "Edsger W. Dijkstra",
//         url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
//         likes: 5,
//         __v: 0,
//     },
//     {
//         _id: "5a422b3a1b54a676234d17f9",
//         title: "Canonical string reduction",
//         author: "Edsger W. Dijkstra",
//         url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
//         likes: 12,
//         __v: 0,
//     },
//     {
//         _id: "5a422b891b54a676234d17fa",
//         title: "First class tests",
//         author: "Robert C. Martin",
//         url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
//         likes: 10,
//         __v: 0,
//     },
//     {
//         _id: "5a422ba71b54a676234d17fb",
//         title: "TDD harms architecture",
//         author: "Robert C. Martin",
//         url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
//         likes: 0,
//         __v: 0,
//     },
//     {
//         _id: "5a422bc61b54a676234d17fc",
//         title: "Type wars",
//         author: "Robert C. Martin",
//         url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
//         likes: 2,
//         __v: 0,
//     },
// ];

// console.log(mostBlogs(blogs));

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
};
