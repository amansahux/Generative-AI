import express from "express";
import useGraph from "./service/graph.ai.service.js"
// console.log(useGraph("hi"))
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});
app.post("/run-graph", async (req, res) => {
  useGraph("What is The Most used Framwork of Js that are used to create Frontend of Any Website in 20 words")
})

export default app;