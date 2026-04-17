import jwt from "jsonwebtoken";
import { cambiarPlanUsuarioService } from "../services/usuarios.services.js";


export const cambiarPlanUsuario = async (req, res) => {


    const correo = req.user.correo;
    const usuarioActualizado = await cambiarPlanUsuarioService(correo);
    res.status(200).json({ message: "Plan cambiado a premium exitosamente", usuario: usuarioActualizado });


};


