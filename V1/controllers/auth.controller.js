import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Usuario from "../models/usuario.model.js";

//LOGIN

export const loginUsuario = async (req, res) => {

    const { nombre, contrasenia } = req.body;

    const usuarioLogueado = await Usuario.findOne({ nombre });

    if (!usuarioLogueado) {
        return res.status(401).json({ message: "Credenciales invalidas" });
    }

    //Si el usuario existe, comparo la contraseña que me pasan con la que tengo en la base de datos.

    const valid = bcrypt.compareSync(contrasenia, usuarioLogueado.contrasenia);

    if (!valid) {
        return res.status(401).json({ message: "Credenciales invalidas" });
    }

    //Si la autenticacion es correcta, genero un token con la información del usuario y lo devuelvo al cliente.
    const token = jwt.sign({ id: usuarioLogueado._id, nombre: usuarioLogueado.nombre, plan: usuarioLogueado.plan },
         process.env.SECRET_JWT, { expiresIn: "1h" });
        res.status(200).json({ message: "Login exitoso", token });
}

//logica de registro de usuario

export const registerUsuario = async (req, res) => {

    const { nombre, contrasenia, plan, confirmarContrasenia } = req.body;

    if(contrasenia!== confirmarContrasenia){
        return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }

    const hashedPassword = bcrypt.hashSync(contrasenia, process.env.ROUNDS);

    const usuarioExistente = await Usuario.findOne ({ nombre });

    if (usuarioExistente) {
        return res.status(400).json({ message: "El nombre de usuario ya esta en uso." });
    }

    let nuevoUsuario = {nombre: req.body.nombre, contrasenia: hashedPassword, plan: req.body.plan};

    await nuevoUsuario.save(); //guardo el nuevo usuario en la base de datos

    const TOKEN = jwt.sign({nombre: nuevoUsuario.nombre, plan: nuevoUsuario.plan}, process.env.SECRET_JWT, { expiresIn: "1h" });

    res.status(201).json({ message: "Usuario registrado exitosamente", token: TOKEN });
}

