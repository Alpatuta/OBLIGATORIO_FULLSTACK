// Recibe un array de roles permitidos y devuelve un middleware
export const accessMiddleware = (rolesPermitidos = []) => (req, res, next) => {
    const user = req.user;

    if (!user || !rolesPermitidos.includes(user.rol)) {
        return res.status(403).json({ message: "No tienes permisos para acceder a esta ruta" });
    }
    next();
};