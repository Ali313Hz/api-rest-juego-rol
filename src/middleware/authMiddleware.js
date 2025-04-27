const jwt = require('jsonwebtoken');

// Clave secreta para firmar tokens JWT (en producción debería estar en variables de entorno)
const JWT_SECRET = 'juego-rol-api-secret-key';

/**
 * Middleware para autenticación con JWT
 */
const authMiddleware = {
    /**
     * Genera un token JWT para un jugador
     * @param {string} playerId - ID del jugador
     * @returns {string} - Token JWT generado
     */
    generateToken: (playerId) => {
        return jwt.sign({ playerId }, JWT_SECRET, { expiresIn: '24h' });
    },

    /**
     * Middleware para verificar token JWT
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     * @param {Function} next - Función para continuar al siguiente middleware
     */
    verifyToken: (req, res, next) => {
        // Obtener token del encabezado de autorización
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
        }

        try {
            // El formato del encabezado debería ser "Bearer TOKEN"
            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ error: 'Token no proporcionado correctamente' });
            }

            // Verificar token
            const verified = jwt.verify(token, JWT_SECRET);
            req.user = verified;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Token inválido o expirado' });
        }
    },

    /**
     * Middleware opcional para endpoints públicos, agrega datos del jugador si hay token
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     * @param {Function} next - Función para continuar al siguiente middleware
     */
    optionalAuth: (req, res, next) => {
        // Obtener token del encabezado de autorización
        const authHeader = req.headers.authorization;

        if (authHeader) {
            try {
                // El formato del encabezado debería ser "Bearer TOKEN"
                const token = authHeader.split(' ')[1];
                if (token) {
                    // Verificar token
                    const verified = jwt.verify(token, JWT_SECRET);
                    req.user = verified;
                }
            } catch (error) {
                // En este caso no respondemos con error, simplemente continuamos
                console.log('Token inválido pero continuando como público');
            }
        }

        next();
    }
};

module.exports = authMiddleware;