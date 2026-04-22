import mongoose from "mongoose";

const ingredienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    cantidad: { type: Number, required: true },
    unidad: { type: String, required: true },
    categoria: { type: String, required: true },
});

export default mongoose.model("Ingrediente", ingredienteSchema);
/**Esto hace que el primer ingrediente se guarda en la coleccion ingredientes. 
 * La generación de la colección es automática según el nombre del modelo.
 *  Lo hace en ingles por lo que cuando creo un modelo que solo con una s al final no hace plural, 
 * lo agrego como tercer parámetro */