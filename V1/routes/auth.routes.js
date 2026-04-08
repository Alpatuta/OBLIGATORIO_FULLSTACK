import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";

const router = express.Router({ mergeParams: true });

export default router;