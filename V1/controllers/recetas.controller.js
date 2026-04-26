import {
    crearRecetaService,
    obtenerRecetasService,
    obtenerRecetaPorIdService,
    actualizarRecetaService,
    eliminarRecetaService,
    obtenerRecetasCombinadasService
} from "../services/recetas.services.js";
import { generarRecetaIAService } from "../services/ai.services.js";

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

export const generarRecetaIA = async (req, res) => {

    const { ingredientes, dificultad } = req.body;

    const receta = await generarRecetaIAService(ingredientes, dificultad);

    res.status(200).json({

        message: "Receta generada exitosamente con IA",

        receta

    });

};