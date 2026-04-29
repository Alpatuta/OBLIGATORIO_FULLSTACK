import rateLimit from 'express-rate-limit';

// Limite global de requests, comentar el limiter cuando hagamos las pruebas en postaman para no tener problemas con el limite de requests, luego descomentar para que funcione el limiter.
export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 10000, // máximo 10000 requests por IP
    message: 'Demasiadas solicitudes desde esta IP, intenta más tarde',
});
