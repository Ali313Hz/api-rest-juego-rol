const world = require('../models/world');

/**
 * Controlador para manejar operaciones relacionadas con las habitaciones
 */
const roomController = {
    /**
     * Obtiene todas las habitaciones visitadas
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    getVisitedRooms: (req, res) => {
        const visitedRooms = world.getVisitedRooms();
        res.json(visitedRooms);
    },

    /**
     * Obtiene información de una habitación específica (si ha sido visitada)
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    getRoomById: (req, res) => {
        const roomId = req.params.id;

        const room = world.getRoomById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }

        // Verificar si la habitación ha sido visitada
        if (!world.isRoomVisited(roomId)) {
            return res.status(403).json({ error: 'No has visitado esta habitación aún' });
        }

        res.json(room);
    },

    /**
     * Obtiene habitaciones adyacentes a una dada (útil para mostrar opciones de movimiento)
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    getAdjacentRooms: (req, res) => {
        const roomId = req.params.id;

        const room = world.getRoomById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }

        // Verificar si la habitación ha sido visitada
        if (!world.isRoomVisited(roomId)) {
            return res.status(403).json({ error: 'No has visitado esta habitación aún' });
        }

        const { x, y } = room.coordinates;
        const adjacentCoordinates = [
            { x: x + 1, y },
            { x: x - 1, y },
            { x, y: y + 1 },
            { x, y: y - 1 }
        ];

        // Filtrar coordenadas válidas y obtener las habitaciones
        const adjacentRooms = adjacentCoordinates
            .map(coord => world.getRoomByCoordinates(coord.x, coord.y))
            .filter(room => room !== null);

        res.json(adjacentRooms);
    },

    /**
     * Obtiene información básica de todas las habitaciones (para debug/admin)
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    getAllRooms: (req, res) => {
        // Este endpoint podría ser restringido solo para administradores
        const rooms = world.rooms.map(room => ({
            id: room.id,
            name: room.name,
            type: room.type,
            coordinates: room.coordinates,
            visited: world.isRoomVisited(room.id)
        }));

        res.json(rooms);
    }
};

module.exports = roomController;