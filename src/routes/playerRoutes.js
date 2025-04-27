const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas públicas
// GET /jugador - Obtener info del jugador por defecto
router.get('/', playerController.getPlayerInfo);

// GET /jugador/:id - Obtener info de un jugador específico
router.get('/:id', playerController.getPlayerInfo);

// GET /jugador/habitacion - Obtener info de la habitación actual del jugador por defecto
router.get('/habitacion', playerController.getCurrentRoom);

// GET /jugador/:id/habitacion - Obtener info de la habitación actual de un jugador específico
router.get('/:id/habitacion', playerController.getCurrentRoom);

// Rutas protegidas
// PUT /jugador/habitacion/:roomId - Mover al jugador por defecto a una habitación
router.put('/habitacion/:roomId', playerController.moveToRoom);

// PUT /jugador/:id/habitacion/:roomId - Mover a un jugador específico a una habitación
router.put('/:id/habitacion/:roomId', playerController.moveToRoom);

// POST /jugador - Crear nuevo jugador
router.post('/', playerController.createPlayer);

module.exports = router;