import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    nombre: { type: String, required: true},
    correo: { type: String, required: true, unique: true },
    contrasenia: { type: String, required: true },
    plan: { type: String, enum: ['plus', 'premium'], default: 'plus' },
    fechaCreacion: { type: Date, default: Date.now },
});

export default mongoose.model('Admin', adminSchema, 'Administradores'); 