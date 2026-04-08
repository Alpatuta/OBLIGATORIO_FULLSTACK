import Ingrediente from "../models/ingrediente.model.js";

export const obtenerIngredientesService = async () => {
    const ingredientes = await Ingrediente.find();
    return ingredientes;
}

export const obtenerIngredientePorIdService = async (id) => {
    const ingrediente = await Ingrediente.findById(id);
    return ingrediente;
}

export const actualizarIngredienteService = async (id, ingredienteActualizado) => {
    const ingrediente = await Ingrediente.findByIdAndUpdate(id, ingredienteActualizado, { returnDocument: "after" });
    return ingrediente;
}

export const eliminarIngredienteService = async (id) => {
    const ingredienteEliminado = await Ingrediente.findByIdAndDelete(id);
    return ingredienteEliminado;
}

export const agregarIngredienteService = async (nuevoIngrediente) => {
    const ingredienteCreado = new Ingrediente(nuevoIngrediente);
    await ingredienteCreado.save();
    return ingredienteCreado;

}