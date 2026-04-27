import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    receta: { type: mongoose.Schema.Types.ObjectId, ref: "Receta", required: true },
    comentario: { type: String, required: true },
    calificacion: { type: Number, min: 1, max: 5, required: true },
    fechaDeCreacion: { type: Date, default: Date.now },
});

export default mongoose.model("Review", reviewSchema);