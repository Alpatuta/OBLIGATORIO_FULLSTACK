import jwt from "jsonwebtoken";
import { cambiarPlanUsuarioService } from "../services/usuarios.services.js";


export const cambiarPlanUsuario = async (req, res) => {

    try {
        const username = req.user.nombre; 
        const usuarioActualizado = await cambiarPlanUsuarioService(username);
        res.status(200).json({ message: "Plan cambiado a premium exitosamente", usuario: usuarioActualizado });
    } catch (error) {
        if (error.message === "Usuario no encontrado") {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === "El usuario ya tiene el plan premium") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Error al cambiar el plan del usuario", error: error.message });
    }


};


