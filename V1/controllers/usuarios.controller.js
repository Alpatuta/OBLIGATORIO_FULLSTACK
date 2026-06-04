import jwt from "jsonwebtoken";
import { cambiarPlanUsuarioService, obtenerUsuariosService } from "../services/usuarios.services.js";


export const cambiarPlanUsuario = async (req, res) => {

    const correo = req.user.correo;
    const usuarioActualizado = await cambiarPlanUsuarioService(correo);
    res.status(200).json({ message: "Plan cambiado a premium exitosamente", usuario: usuarioActualizado });

};

export const cambiarPlanUsuarioAdmin = async (req, res) => {

    const { correo } = req.body;
    const usuarioActualizado = await cambiarPlanUsuarioService(correo);
    res.status(200).json({ message: "Plan cambiado a premium exitosamente", usuario: usuarioActualizado });
};

export const obtenerUsuarios = async (req, res) => {
    const usuarios = await obtenerUsuariosService();
    res.status(200).json(usuarios);
}

