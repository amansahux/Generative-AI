import express from "express";
import dotenv from "dotenv";
import graph from "./ai/graph.ai.ts";
dotenv.config();

const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.send("Server Running 🚀");
});

app.post("/api/run-graph", async (req, res) => {
  const { prompt } = req.body;
  const result = await graph.invoke({ prompt: prompt })
  console.log(result)
  res.status(200).json(
    {
      message: "Models Responded successfully",
      result
    }
  )
})

export default app;