import { crearCategoriaService,
    obtenerCategoriaPorIdService,
    obtenerCategoriasService,
    eliminarCategoriaService,
    actualizarCategoriaService } from "../services/categoria.services.js";    


    //ALTA
    
export const crearCategoria = async (req, res) => {

    const categoria = await crearCategoriaService(req.body);
    res.status(201).json({ message: "Categoría creada exitosamente", categoria });
};

//CONSULTA GENERAL DE CATEGORIAS

export const obtenerCategorias = async (req, res) => {

    const categorias = await obtenerCategoriasService();
    res.status(200).json({ message: "Categorías obtenidas exitosamente", categorias });

};

//CONSULTA POR ID DE CATEGORIA

export const obtenerCategoriaPorId = async (req, res) => {

    const categoria = await obtenerCategoriaPorIdService(req.params.id);

    res.status(200).json({ message: "Categoría obtenida exitosamente", categoria });

};

//ELIMINAR CATEGORIA

export const eliminarCategoria = async (req, res) => {

    const categoriaEliminada = await eliminarCategoriaService(req.params.id);
    res.status(200).json({ message: "Categoría eliminada exitosamente", categoria: categoriaEliminada });

};

//ACTUALIZAR CATEGORIA

export const actualizarCategoria = async (req, res) => {

    const categoriaActualizada = await actualizarCategoriaService(req.params.id, req.body);
    res.status(200).json({ message: "Categoría actualizada exitosamente", categoria: categoriaActualizada });

};