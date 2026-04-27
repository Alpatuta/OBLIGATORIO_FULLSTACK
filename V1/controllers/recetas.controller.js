import {
    crearRecetaService,
    obtenerRecetasService,
    obtenerRecetaPorIdService,
    actualizarRecetaService,
    eliminarRecetaService,
    obtenerRecetasCombinadasService, generarRecetaIAService, adaptarRecetaIAService
} from "../services/recetas.services.js";


//ALTA

export const crearReceta = async (req, res) => {

    const receta = await crearRecetaService(req.body, req.user.correo);
    res.status(201).json({ message: "Receta creada exitosamente", receta });

};

//CONSULTA GENERAL DE RECETAS

export const obtenerRecetas = async (req, res) => {

    const recetas = await obtenerRecetasService(req.query);
    res.status(200).json({ message: "Recetas obtenidas exitosamente", recetas });

};

//CONSULTA POR ID DE RECETAS

export const obtenerRecetaPorId = async (req, res) => {

    const receta = await obtenerRecetaPorIdService(req.params.id);

    res.status(200).json({ message: "Receta obtenida exitosamente", receta });

};

//ACTUALIZAR RECETA

export const actualizarReceta = async (req, res) => {

    const recetaActualizada = await actualizarRecetaService(req.params.id, req.body, req.user.correo);
    res.status(200).json({ message: "Receta actualizada exitosamente", receta: recetaActualizada });

};

//ELIMINAR RECETA

export const eliminarReceta = async (req, res) => {

    const recetaEliminada = await eliminarRecetaService(req.params.id, req.user.correo);
    res.status(200).json({ message: "Receta eliminada exitosamente", receta: recetaEliminada });

};

// OBTENER RECETAS COMBINADAS

export const obtenerRecetasCombinadas = async (req, res) => {

    const recetas = await obtenerRecetasCombinadasService(req.query);
    res.status(200).json({ message: "Recetas combinadas obtenidas exitosamente", recetas });

};

// GENERAR RECETA CON IA

export const generarYGuardarRecetaIA = async (req, res) => {

    const { ingredientes, dificultad, categoria } = req.body;

    const receta = await generarRecetaIAService(

        ingredientes,

        dificultad,

        req.user.correo,

        categoria

    );

    res.status(201).json({

        message: "Receta generada y guardada exitosamente",

        receta

    });

};

//MEJORAR RECETA EXISTENTE CON IA

export const adaptarRecetaIA = async (req, res) => {

    const { tipo } = req.body;

    const nuevaReceta = await adaptarRecetaIAService(
        req.params.id,
        tipo,
        req.user.correo
    );

    res.status(201).json({
        message: "Receta adaptada y guardada",
        receta: nuevaReceta
    });
};