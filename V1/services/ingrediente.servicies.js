import Ingrediente from "../models/ingrediente.model.js";
import { isValidObjectId } from "mongoose";

export const obtenerIngredientesService = async () => {
    const ingredientes = await Ingrediente.find();

    if (ingredientes.length === 0) {
        const error = new Error("No se encontraron ingredientes");
        error.status = 404;
        throw error;
    }

    return ingredientes;
}

export const obtenerIngredientePorIdService = async (id) => {
    if (!isValidObjectId(id)) {
        const error = new Error("ID no válido");
        error.status = 400;
        throw error;
    }
    const ingrediente = await Ingrediente.findById(id);

    if (!ingrediente) {
        const error = new Error("Ingrediente no encontrado");
        error.status = 404;
        throw error;
    }
    return ingrediente;
}

export const actualizarIngredienteService = async (id, ingredienteActualizado) => {
    if (!isValidObjectId(id)) {
        const error = new Error("ID no válido");
        error.status = 400;
        throw error;
    }

    const ingredienteExistente = await Ingrediente.findOne({ nombre: ingredienteActualizado.nombre, _id: { $ne: id } });
    if (ingredienteExistente) {
        const error = new Error("Ya existe un ingrediente con ese nombre");
        error.status = 400;
        throw error;
    }

    const ingrediente = await Ingrediente.findByIdAndUpdate(id, ingredienteActualizado, { returnDocument: "after" });

    if (!ingrediente) {
        const error = new Error("Ingrediente no encontrado");
        error.status = 404;
        throw error;
    }

    return ingrediente;
}

export const eliminarIngredienteService = async (id) => {
    if (!isValidObjectId(id)) {
        const error = new Error("ID no válido");
        error.status = 400;
        throw error;
    }
    const ingredienteEliminado = await Ingrediente.findByIdAndDelete(id);
    if (!ingredienteEliminado) {
        const error = new Error("Ingrediente no encontrado");
        error.status = 404;
        throw error;
    }
    return ingredienteEliminado;
}

export const agregarIngredienteService = async (nuevoIngrediente) => {
    const ingredienteExistente = await Ingrediente.findOne({ nombre: nuevoIngrediente.nombre });

    if (ingredienteExistente) {
        const error = new Error("Ya existe un ingrediente con ese nombre");
        error.status = 400;
        throw error;
    }

    const ingredienteCreado = new Ingrediente(nuevoIngrediente);
    await ingredienteCreado.save();
    return ingredienteCreado;

}