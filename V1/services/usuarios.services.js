import Usuario from "../models/usuario.model.js";

export const cambiarPlanUsuarioService = async (nombre) => {
    const usuario = await Usuario.findOne({ nombre });

    if (!usuario) {
        throw new Error("Usuario no encontrado");
    }  
    if (usuario.plan === "premium") {
        throw new Error("El usuario ya tiene el plan premium");
    }

    usuario.plan = "premium";
    await usuario.save();
    return usuario;
}

