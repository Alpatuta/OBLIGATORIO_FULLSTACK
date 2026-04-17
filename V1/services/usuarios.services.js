import Usuario from "../models/usuario.model.js";

export const cambiarPlanUsuarioService = async (correo) => {
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
        const error = new Error("Usuario no encontrado");
        error.status = 404;
        throw error;
    }
    if (usuario.plan === "premium") {
        const error = new Error("El usuario ya tiene el plan premium");
        error.status = 400;
        throw error;
    }

    usuario.plan = "premium";
    await usuario.save();
    return usuario;
}

