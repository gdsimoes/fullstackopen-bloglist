const config = require("./config");
const logger = require("./logger");
const mongoose = require("mongoose");

async function connectToDatabase() {
    logger.info("connecting to", config.MONGODB_URI);

    // Once again, is this necessary?
    // mongoose.set("strictQuery", false);

    try {
        await mongoose.connect(config.MONGODB_URI);
        logger.info("connected to MongoDB");
    } catch (error) {
        logger.error("error connecting to MongoDB:", error.message);
    }
}

module.exports = connectToDatabase;
