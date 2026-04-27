import Categoria from "../models/categoria.model.js";
import { isValidObjectId } from "mongoose";

//CREAR CATEGORIA

export const crearCategoriaService = async (categoriaData) => {
    const categoriaExistente = await Categoria.findOne({ nombre: categoriaData.nombre });

    if (categoriaExistente) {
        const error = new Error("La categoría ya existe");
        error.status = 400;
        throw error;
    }

    const nuevaCategoria = new Categoria(categoriaData);
    await nuevaCategoria.save();
    return nuevaCategoria;
}

//OBTENER CATEGORIAS

export const obtenerCategoriasService = async () => {
    const categorias = await Categoria.find().populate("recetas","titulo"); // Popula solo el campo "nombre" de las recetas relacionadas
    return categorias;
}

//OBTENER CATEGORIA POR ID

export const obtenerCategoriaPorIdService = async (id) => {
    if (!isValidObjectId(id)) {
        const error = new Error("ID no válido");
        error.status = 400;
        throw error;
    }
    
    const categoria = await Categoria.findById(id).populate("recetas", "nombre", "descripcion", "dificultad"); 
    if (!categoria) {
        const error = new Error("Categoría no encontrada");
        error.status = 404;
        throw error;
    }
    return categoria;

}

//ELIMINAR CATEGORIA

export const eliminarCategoriaService = async (id) => {
    if (!isValidObjectId(id)) {
        const error = new Error("ID no válido");
        error.status = 400;
        throw error;
    }
    
    const categoriaEliminada = await Categoria.findByIdAndDelete(id);
    if (!categoriaEliminada) {
        const error = new Error("Categoría no encontrada");
        error.status = 404;
        throw error;
    }
    return categoriaEliminada;
}

//ACTUALIZAR CATEGORIA

export const actualizarCategoriaService = async (id, categoriaData) => {
    if (!isValidObjectId(id)) {
        const error = new Error("ID no válido");
        error.status = 400;
        throw error;
    }

    const categoriaExistente = await Categoria.findOne({ nombre: categoriaData.nombre });
    if (categoriaExistente && categoriaExistente._id.toString() !== id) {
        const error = new Error("Ya existe una categoría con ese nombre");
        error.status = 400;
        throw error;
    }

    const categoriaActualizada = await Categoria.findByIdAndUpdate(id, categoriaData, { new: true });
    if (!categoriaActualizada) {
        const error = new Error("Categoría no encontrada");
        error.status = 404;
        throw error;
    }
    return categoriaActualizada;
}