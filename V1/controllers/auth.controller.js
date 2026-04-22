import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Usuario from "../models/usuario.model.js";
import { registrarUsuarioService } from "../services/auth.services.js";

//LOGIN DE USUARIO

export const loginUsuario = async (req, res) => {

    const { correo, contrasenia } = req.body;

    const usuarioLogueado = await Usuario.findOne({ correo });

    if (!usuarioLogueado) {
        return res.status(401).json({ message: "Credenciales invalidas" });
    }

    //Si el usuario existe, comparo la contraseña que me pasan con la que tengo en la base de datos.

    const valid = bcrypt.compareSync(contrasenia, usuarioLogueado.contrasenia);

    if (!valid) {
        return res.status(401).json({ message: "Credenciales invalidas" });
    }

    //Si la autenticación es correcta, genero un token con la información del usuario y lo devuelvo al cliente.
    const token = jwt.sign({ idUsuario: usuarioLogueado._id, nombre: usuarioLogueado.nombre, correo: usuarioLogueado.correo, rol: usuarioLogueado.rol },
        process.env.SECRET_JWT, { expiresIn: "1h" });
    res.status(200).json({ message: "Login exitoso", token });
}

//logica de registro de usuario

export const registerUsuario = async (req, res) => {

    const { nombre, contrasenia, confirmarContrasenia, correo } = req.body;

    if (contrasenia !== confirmarContrasenia) {
        return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    const hashedPassword = bcrypt.hashSync(contrasenia, process.env.ROUNDS);

    const usuarioExistente = await Usuario.findOne({ correo });

    if (usuarioExistente) {
        return res.status(400).json({ message: "El correo ya esta en uso." });
    }

    let nuevoUsuario = { nombre: req.body.nombre, contrasenia: hashedPassword, correo: req.body.correo };

    const usuarioCreado = await registrarUsuarioService(nuevoUsuario);

    const TOKEN = jwt.sign({ idUsuario: usuarioCreado._id, nombre: usuarioCreado.nombre, correo: usuarioCreado.correo, rol: usuarioCreado.rol }, process.env.SECRET_JWT, { expiresIn: "1h" });

    res.status(201).json({ message: "Usuario registrado exitosamente", token: TOKEN });
}

