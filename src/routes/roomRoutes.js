const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /habitaciones - Obtener habitaciones visitadas
router.get('/', roomController.getVisitedRooms);

// GET /habitaciones/:id - Obtener detalles de una habitación específica (si ya fue visitada)
router.get('/:id', roomController.getRoomById);

// GET /habitaciones/:id/adyacentes - Obtener habitaciones adyacentes a una dada
router.get('/:id/adyacentes', roomController.getAdjacentRooms);

// Ruta admin (podría protegerse con middleware de autenticación)
// GET /habitaciones/admin/all - Obtener todas las habitaciones (para admin/debug)
router.get('/admin/all', roomController.getAllRooms);

module.exports = router;