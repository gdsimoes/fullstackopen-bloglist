const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (req, res) => {
    const { username, name, password } = req.body;

    // Validate password
    if (typeof password !== "string") {
        throw { name: "ValidationError", message: "Password must be a string" };
    } else if (password.length < 3) {
        throw { name: "ValidationError", message: "Password must be at least 3 characters long" };
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash,
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
    const users = await User.find({});
    response.json(users);
});

module.exports = usersRouter;
