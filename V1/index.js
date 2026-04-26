import express from 'express';
import authRouter from './routes/auth.routes.js';
import ingredientesRouter from './routes/ingredientes.routes.js';
import usuariosRouter from './routes/usuarios.routes.js';
import recetasRouter from './routes/recetas.routes.js';
import categoriasRouter from './routes/categorias.routes.js';
import aiRouter from "./routes/ai.routes.js";
import uploadRouter  from './routes/uploads.routes.js';
import { autorizationMiddleware } from './middlewares/authorization.middleware.js';

const router = express.Router({ mergeParams: true });


//RUTAS DESPROTEGIDAS
router.use("/auth", authRouter);



//MIDDLEWARE DE AUTORIZACIÓN
router.use(autorizationMiddleware);

//TODO: tenemos que agregar access middleware para el rol del usuario plus y solo el tenga acceso a cambiarDePlan segun lo que dijo el profe el 22/4/26

//RUTAS PROTEGIDAS
router.use("/ingredientes", ingredientesRouter);

router.use("/usuarios",usuariosRouter);

router.use("/recetas", recetasRouter);

router.use("/categorias", categoriasRouter);

router.use("/ai", aiRouter);

router.use("/uploads", uploadRouter);

export default router;