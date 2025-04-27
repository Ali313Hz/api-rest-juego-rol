const express = require('express');
const router = express.Router();
const combatController = require('../controllers/combatController');
const authMiddleware = require('../middleware/authMiddleware');

// GET /combate/:idPersonaje - Obtener atributos actuales del personaje
router.get('/:idPersonaje', combatController.getCharacterAttributes);

// POST /combate?p1=idPersonaje1&p2=idPersonaje2 - Realizar combate entre personajes
router.post('/', combatController.startCombat);

// PUT /combate/:idPersonaje - Actualizar atributos de un personaje (curación)
router.put('/:idPersonaje', combatController.updateCharacterAttributes);

module.exports = router;