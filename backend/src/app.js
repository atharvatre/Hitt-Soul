import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
); //for cors issue tackling . VImp
app.use(express.json({ limit: "16kb" })); //amount of json to be handled by the server
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //amount of urlencoded data to be handled by the server
app.use(express.static("public")); //for serving static files
app.use(cookieParser()); //for parsing cookies

// //routes import
// import userRouter from "./routes/user.routes.js";

// //routes declaration
// app.use("/api/v1/users", userRouter);

app.post("/api/chat", async (req, res) => {
  try {
    const body = req.body;
    console.log("Received request body:", body);
    const response = await fetch(process.env.LANGFLOW_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LANFLOW_BEARERR_TOKEN}`,
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error forwarding request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
export default app;

