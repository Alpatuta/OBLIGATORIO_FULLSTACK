//esto se hace para validar el body de las peticiones, se le pasa el schema de Joi y se valida el body, 
// si hay errores se devuelve un 400 con los errores, 
// si no se guarda el body validado en req.validatedBody y 
// se llama a next() para continuar con la ejecución del controlador

export const validateBodyMiddleware = schema => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({ error: error.details });
    }
    req.validatedBody = value;
    //req.body = value;
    next();
};
