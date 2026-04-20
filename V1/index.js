import express from 'express';
import authRouter from './routes/auth.routes.js';
import ingredientesRouter from './routes/ingredientes.routes.js';
import usuariosRouter from './routes/usuarios.routes.js';
import recetasRouter from './routes/recetas.routes.js';
import aiRouter from "./routes/ai.routes.js";
import { autorizationMiddleware } from './middlewares/authorization.middleware.js';

const router = express.Router({ mergeParams: true });


//RUTAS DESPROTEGIDAS
router.use("/auth", authRouter);



//MIDDLEWARE DE AUTORIZACIÓN
router.use(autorizationMiddleware);

//RUTAS PROTEGIDAS
router.use("/ingredientes", ingredientesRouter);

router.use("/usuarios",usuariosRouter);

router.use("/recetas", recetasRouter);

router.use("/ai", aiRouter);

export default router;