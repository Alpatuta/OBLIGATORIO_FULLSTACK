import {
    agregarIngredienteService,
    obtenerIngredientesService,
    obtenerIngredientePorIdService,
    actualizarIngredienteService,
    eliminarIngredienteService
} from "../services/ingrediente.servicies.js";

export const obtenerIngredientes = async (req, res) => {
    const ingredientesObtenidos = await obtenerIngredientesService();
    res.status(200).json({ message: "Obteniendo ingredientes", ingredientes: ingredientesObtenidos });
};

export const obtenerIngredientePorId = async (req, res) => {
    const { id } = req.params;
    const ingredienteObtenido = await obtenerIngredientePorIdService(id);
    res.status(200).json({ message: `Obteniendo ingrediente con ID: ${id}`, ingrediente: ingredienteObtenido });
};

export const actualizarIngrediente = async (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;
    const ingredienteActualizado = await actualizarIngredienteService(id, datosActualizados);
    res.status(200).json({ message: `Ingrediente con ID: ${id} actualizado`, ingrediente: ingredienteActualizado });
}

export const eliminarIngrediente = async (req, res) => {
    const { id } = req.params;
    const ingredienteEliminado = await eliminarIngredienteService(id);
    res.status(200).json({ message: `Ingrediente con ID: ${id} eliminado`, ingrediente: ingredienteEliminado });
}

export const agregarIngrediente = async (req, res) => {
    let nuevoIngrediente = req.body;
    const ingredienteCreadoService = await agregarIngredienteService(nuevoIngrediente);
    res.status(201).json({ message: "Ingrediente agregado exitosamente", ingrediente: ingredienteCreadoService });
}