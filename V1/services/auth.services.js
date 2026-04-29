import bcrypt from "bcryptjs";
import Usuario from "../models/usuario.model.js";

export const loginUsuarioService = async ({ correo, contrasenia }) => {
    const usuarioLogueado = await Usuario.findOne({ correo });

    if (!usuarioLogueado) {
        const error = new Error("Credenciales invalidas");
        error.status = 401;
        throw error;
    }

    const valid = bcrypt.compareSync(contrasenia, usuarioLogueado.contrasenia);

    if (!valid) {
        const error = new Error("Credenciales invalidas");
        error.status = 401;
        throw error;
    }

    return usuarioLogueado;
};

export const registrarUsuarioService = async (usuarioData) => {
    const { nombre, contrasenia, confirmarContrasenia, correo, rol } = usuarioData;

    if (contrasenia !== confirmarContrasenia) {
        const error = new Error("Las contraseñas no coinciden");
        error.status = 400;
        throw error;
    }

    const usuarioExistente = await Usuario.findOne({ correo });

    if (usuarioExistente) {
        const error = new Error("El correo ya esta en uso.");
        error.status = 400;
        throw error;
    }

    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = bcrypt.hashSync(contrasenia, saltRounds);

    const nuevoUsuario = {
        nombre,
        correo,
        contrasenia: hashedPassword,
        rol: rol || "user"
    };

    const usuarioCreado = new Usuario(nuevoUsuario);
    await usuarioCreado.save();

    return usuarioCreado;
};