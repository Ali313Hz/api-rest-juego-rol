const { Player, players } = require('../models/player');
const world = require('../models/world');

/**
 * Controlador para manejar operaciones relacionadas con los jugadores
 */
const playerController = {
    /**
     * Obtiene información del jugador
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    getPlayerInfo: (req, res) => {
        const playerId = req.params.id || 'player1'; // Si no hay ID, usar jugador por defecto

        const player = players.get(playerId);
        if (!player) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }

        res.json(player.getInfo());
    },

    /**
     * Obtiene información de la habitación actual del jugador
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    getCurrentRoom: (req, res) => {
        const playerId = req.params.id || 'player1';

        const player = players.get(playerId);
        if (!player) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }

        const room = world.getRoomById(player.currentRoom);
        if (!room) {
            return res.status(404).json({ error: 'Habitación no encontrada' });
        }

        // Marcar habitación como visitada
        world.markRoomAsVisited(room.id);

        res.json(room);
    },

    /**
     * Mueve al jugador a otra habitación
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    moveToRoom: (req, res) => {
        const playerId = req.params.id || 'player1';
        const targetRoomId = req.params.roomId;

        const player = players.get(playerId);
        if (!player) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }

        const targetRoom = world.getRoomById(targetRoomId);
        if (!targetRoom) {
            return res.status(404).json({ error: 'Habitación destino no encontrada' });
        }

        // Verificar si las habitaciones son adyacentes
        if (!world.areRoomsAdjacent(player.currentRoom, targetRoomId)) {
            return res.status(400).json({
                error: 'No puedes moverte a esa habitación, no es adyacente a tu posición actual'
            });
        }

        // Mover al jugador
        player.moveToRoom(targetRoomId);

        // Marcar habitación como visitada
        world.markRoomAsVisited(targetRoomId);

        res.json({
            message: `Te has movido a ${targetRoom.name}`,
            room: targetRoom
        });
    },

    /**
     * Crear un nuevo jugador
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    createPlayer: (req, res) => {
        const { name, id } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Se requiere un nombre para el jugador' });
        }

        // Crear ID único si no se proporciona
        const playerId = id || `player-${Date.now()}`;

        // Verificar si ya existe un jugador con ese ID
        if (players.has(playerId)) {
            return res.status(400).json({ error: 'Ya existe un jugador con ese ID' });
        }

        // Crear nuevo jugador y guardarlo
        const newPlayer = new Player(playerId, name);
        players.set(playerId, newPlayer);

        // Marcar la habitación inicial como visitada
        world.markRoomAsVisited(newPlayer.currentRoom);

        res.status(201).json({
            message: 'Jugador creado con éxito',
            player: newPlayer.getInfo()
        });
    }
};

module.exports = playerController;