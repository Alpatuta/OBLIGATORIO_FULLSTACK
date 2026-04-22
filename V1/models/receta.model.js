import mongoose from "mongoose";
// Para relacionar la receta con una categoría, importo el modelo de Categoria.
import Categoria from "./categoria.model.js";

const recetaSchema = new mongoose.Schema({
  titulo: { type: String, required: true, unique: true },
  descripcion: { type: String, required: true },
  ingredientes: [{ type: String, required: true }],
  pasos: [{ type: String, required: true }],
  autor: { type: String, required: true },
  fechaDeCreacion: { type: Date, default: Date.now },
  dificultad: {
    type: String,
    enum: ["Fácil", "Media", "Difícil"],
    required: true,
  },
  // Para relacionar la receta con una categoría, uso el ObjectId de MongoDB y hago referencia al modelo de Categoria.
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

export default mongoose.model("Receta", recetaSchema);
