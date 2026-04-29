import jwt from "jsonwebtoken";
import { loginUsuarioService, registrarUsuarioService } from "../services/auth.services.js";

// LOGIN DE USUARIO
export const loginUsuario = async (req, res) => {
    const usuarioLogueado = await loginUsuarioService(req.body);

    const token = jwt.sign(
        {
            idUsuario: usuarioLogueado._id,
            nombre: usuarioLogueado.nombre,
            correo: usuarioLogueado.correo,
            rol: usuarioLogueado.rol
        },
        process.env.SECRET_JWT,
        { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login exitoso", token });
};

// REGISTRO DE USUARIO
export const registerUsuario = async (req, res) => {
    const usuarioCreado = await registrarUsuarioService(req.body);

    const token = jwt.sign(
        {
            idUsuario: usuarioCreado._id,
            nombre: usuarioCreado.nombre,
            correo: usuarioCreado.correo,
            rol: usuarioCreado.rol
        },
        process.env.SECRET_JWT,
        { expiresIn: "1h" }
    );

    res.status(201).json({
        message: "Usuario registrado exitosamente",
        token
    });
};