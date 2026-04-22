
//Me traigo el usuario que se ha autenticado en el token y verificio si tiene rol admin 
export const accessMiddleware = (req, res, next) => {
    const user = req.user;

    if (user.rol !== "admin") {
        return res.status(403).json({ message: "No tienes permisos para acceder a esta ruta" });
    }
    next();
}