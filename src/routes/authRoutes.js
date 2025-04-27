const express = require('express');
const router = express.Router();
const { players, Player } = require('../models/player');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Ruta para iniciar sesión con un jugador existente
 * POST /auth/login
 */
router.post('/login', (req, res) => {
    const { playerId, name } = req.body;

    if (!playerId) {
        return res.status(400).json({ error: 'Se requiere un ID de jugador' });
    }

    // Verificar si el jugador existe
    if (!players.has(playerId)) {
        return res.status(404).json({ error: 'Jugador no encontrado' });
    }

    // Generar token JWT
    const token = authMiddleware.generateToken(playerId);

    // Devolver token y datos del jugador
    res.json({
        message: 'Inicio de sesión exitoso',
        token,
        player: players.get(playerId).getInfo()
    });
});

/**
 * Ruta para registrar un nuevo jugador
 * POST /auth/register
 */
router.post('/register', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Se requiere un nombre para el jugador' });
    }

    // Crear ID único para el nuevo jugador
    const playerId = `player-${Date.now()}`;

    // Crear nuevo jugador
    const newPlayer = new Player(playerId, name);
    players.set(playerId, newPlayer);

    // Generar token JWT
    const token = authMiddleware.generateToken(playerId);

    // Devolver token y datos del jugador
    res.status(201).json({
        message: 'Jugador registrado con éxito',
        token,
        player: newPlayer.getInfo()
    });
});

module.exports = router;