import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import jobsRouter from "./routes/jobs.route";

configDotenv({ path: "./.env.local" || ".env" });

const app = express();

// cors yata
app.use(cors());

// middleware haru yata

// router haru yata
app.use("/api", jobsRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
