import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import "dotenv/config"

const redis = Redis.fromEnv();

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "60 s")
});

export default rateLimit;
