import rateLimit from 'express-rate-limit';

// Limite global de requests
export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 10, // máximo 10 requests por IP
    message: 'Demasiadas solicitudes desde esta IP, intenta más tarde',
});
