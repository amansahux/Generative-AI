import express from "express";
import useGraph from "./service/graph.ai.service.js"
// console.log(useGraph("hi"))
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});
app.post("/run-graph", async (req, res) => {
  useGraph("best programming language for dsa")
})

export default app;