import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

async function connect() {
  const dbUri = process.env.DB_CONNECTION as string;
  try {
    await mongoose.connect(dbUri);
    logger.info("DB connected");
  } catch (error) {
    logger.error("Could not connect to db");
    process.exit(1);
  }
}

export default connect;
