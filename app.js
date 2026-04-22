import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import v1Router from "./V1/index.js";
import { limiter } from "./V1/middlewares/limiter.middleware.js";
import { connectDB } from "./V1/config/db.js";
import { notFoundMiddleware } from "./V1/middlewares/notFound.middleware.js";

dotenv.config();

connectDB();

const app = express();

app.set('trust proxy', 1);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);

app.use("/V1", v1Router);

app.use(notFoundMiddleware);

export default app;