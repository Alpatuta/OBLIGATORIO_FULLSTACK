import mongoose from "mongoose";

const recetaSchema = new mongoose.Schema({
    recetaId: { type: String, required: true, unique: true },
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    ingredientes: [{ type: String, required: true }],
    pasos: [{ type: String, required: true }],
    autor: { type: String, required: true },
    fechaDeCreacion: { type: Date, default: Date.now },
    dificultad: { type: String, enum: ['Fácil', 'Media', 'Difícil'], required: true },
    
});

export default mongoose.model("Receta", recetaSchema);