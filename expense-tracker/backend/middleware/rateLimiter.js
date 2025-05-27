import rateLimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await rateLimit.limit("my-rate-limit");

    if (!success) {
      return res.status(429).json({ message: "Too many requests! Try again in a minute." });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    return res.status(500).json({ message: "Internal server error from rate limiter" });
  }
};

export default rateLimiter;
