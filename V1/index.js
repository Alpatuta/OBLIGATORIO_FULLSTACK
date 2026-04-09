import express from 'express';
import authRouter from './routes/auth.routes.js';
import ingredientesRouter from './routes/ingredientes.routes.js';
import { autorizationMiddleware } from './middlewares/authorization.middleware.js';

const router = express.Router({ mergeParams: true });


//RUTAS DESPROTEGIDAS
router.use("/auth", authRouter);



//MIDDLEWARE DE AUTORIZACIÓN
router.use(autorizationMiddleware);

//RUTAS PROTEGIDAS
router.use("/ingredientes", ingredientesRouter);



export default router;