import express from 'express';
import authRouter from './routes/auth.routes.js';
import { autorizationMiddleware } from './middlewares/authorization.middleware.js';

const router = express.Router({ mergeParams: true });

router.use("/auth", authRouter);

router.use(autorizationMiddleware);

export default router;