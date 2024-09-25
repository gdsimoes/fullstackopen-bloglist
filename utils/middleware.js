const logger = require("./logger");

const requestLogger = (req, res, next) => {
    logger.info("Method:", req.method);
    logger.info("Path:  ", req.path);
    logger.info("Body:  ", req.body);
    logger.info("---");
    next();
};

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
    logger.error(error.message);

    if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
    } else if (error.name === "MongoServerError" && error.message.includes("E11000 duplicate key error")) {
        return res.status(400).json({ error: "expected `username` to be unique" });
    } else if (error.name === "InvalidCredentials") {
        return res.status(401).json({ error: error.message });
    }

    next(error);
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
};
