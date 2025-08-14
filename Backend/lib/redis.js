import Redis from "ioredis"
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis(process.env.REDIS_URL);
await redis.set("foo", "bar");

export default redis