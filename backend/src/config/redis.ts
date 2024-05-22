import createClient from "ioredis";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.REDIS_HOST);

const connection = new createClient({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379"),
  maxRetriesPerRequest: null,
});

connection.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default connection;
