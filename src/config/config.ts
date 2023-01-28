import "dotenv/config.js";

const PORT: string = process.env.PORT ?? "5000";
const MONGO_URI: string =
  process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/database";
const SESSION_SECRET: string = process.env.SESSION_SECRET ?? "valenoirs";
const SESSION_COLLECTION_NAME: string =
  process.env.SESSION_COLLECTION_NAME ?? "session";
const SESSION_LIFETIME: number = 1000 * 60 * 60 * 24; // a day

const config = {
  PORT,
  MONGO_URI,
  SESSION_SECRET,
  SESSION_COLLECTION_NAME,
  SESSION_LIFETIME,
};

export default config;
