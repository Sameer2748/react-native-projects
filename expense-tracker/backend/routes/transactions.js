import express from "express";
import { sql } from "../config/db.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await sql`
        SELECT * FROM transactions
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        `;

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, price, category, user_id } = req.body;

    if (!title || !user_id || !category || price === undefined) {
      return res.status(400).json({ message: "all field are required" });
    }

    const transaction = await sql`
        INSERT INTO transactions(user_id,title, price, category)
        VALUES (${user_id}, ${title}, ${price}, ${category} )
        RETURNING * 
        `;

    res.status(201).json({ message: "sucess", transaction });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internla server error", error });
    return;
  }
});

router.get("/summary/:userId", async(req,res)=>{
    try {
        const {userId} = req.params;
        
        const balanceResult = await sql`
        SELECT COALESCE(SUM(price), 0) as balance FROM transactions WHERE user_id = ${userId}
        `

        const incomeResult = await sql`
        SELECT COALESCE(SUM(price), 0) as income FROM transactions WHERE user_id = ${userId} AND price > 0
        `
        const expensesResult = await sql`
        SELECT COALESCE(SUM(price), 0) as expense FROM transactions WHERE user_id = ${userId} AND price < 0
        `

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expense: expensesResult[0].expense
        })

    } catch (error) {
        res.status(500).json({ message: "erorr getting the summary", error });
    return;
    }
})

router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if(isNaN(parseInt(id))){
        res.status(400).json({ message: "transaction id invalid" });
        return;
      }

    const result = await sql`
    DELETE FROM transactions where id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      res.status(200).json({ message: "transaction not found" });
    }

    res.status(200).json("success deleting ");
  } catch (error) {
    res.status(500).json({ message: "error in deleting", error });
    return;
  }
});


export default router;