import mongoose from "mongoose";
import Receta from "./receta.model.js";

const categoriaSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    descripcion: { type: String, required: true },
    //Agrego un campo de recetas para poder mostrar las recetas que pertenecen a cada categoría. Este campo es un array de ObjectId de MongoDB que hace referencia al modelo de Receta.
    recetas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Receta" }],
});

export default mongoose.model("Categoria", categoriaSchema);