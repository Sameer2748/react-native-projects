import express from "express";
import dotenv from "dotenv";
import { initDB, sql } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import TransactionRouter from "./routes/transactions.js"

dotenv.config();
const port = process.env.PORT || 5002;
const app = express();

// middleware
app.use(rateLimiter);
app.use(express.json());

app.use("/api/transactions", TransactionRouter);

initDB().then(() => {
  app.listen(port, console.log("started on port", port));
});
