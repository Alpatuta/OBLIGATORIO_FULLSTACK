import Usuario from "../models/usuario.model.js";


export const registrarUsuarioService = async (nuevoUsuario) => {
    const usuarioCreado = new Usuario(nuevoUsuario);
    await usuarioCreado.save();
    return usuarioCreado;
}