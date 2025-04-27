const { players } = require('../models/player');
const Character = require('../models/character');
const world = require('../models/world');
/**
 * Controlador para manejar el sistema de combate
 */
const combatController = {
    /**
     * Obtiene los atributos de un personaje (jugador o enemigo)
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    getCharacterAttributes: (req, res) => {
        const characterId = req.params.idPersonaje;

        // Primero buscamos si es un jugador
        if (players.has(characterId)) {
            const player = players.get(characterId);
            return res.json({
                id: player.id,
                name: player.name,
                type: player.type,
                health: player.health,
                maxHealth: player.maxHealth,
                attack: player.attack,
                defense: player.defense,
                magic: player.magic,
                strength: player.strength,
                level: player.level
            });
        }

        // Si no es jugador, buscamos en todas las habitaciones si es un enemigo
        for (const room of world.rooms) {
            const enemy = room.enemies.find(enemy => enemy.id === characterId);
            if (enemy) {
                return res.json(enemy);
            }
        }

        return res.status(404).json({ error: 'Personaje no encontrado' });
    },

    /**
     * Inicia un combate entre dos personajes
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    startCombat: (req, res) => {
        const { p1, p2 } = req.query;

        if (!p1 || !p2) {
            return res.status(400).json({ error: 'Se requieren dos personajes para el combate (p1 y p2)' });
        }

        // Obtener el primer personaje
        let character1;
        if (players.has(p1)) {
            character1 = players.get(p1);
        } else {
            // Buscar enemigo en todas las habitaciones
            for (const room of world.rooms) {
                const enemy = room.enemies.find(enemy => enemy.id === p1);
                if (enemy) {
                    // Crear un Character temporal para el enemigo
                    character1 = new Character(
                        enemy.id,
                        enemy.type,
                        'enemy',
                        enemy.health,
                        enemy.attack,
                        enemy.defense,
                        enemy.magic,
                        enemy.strength
                    );
                    break;
                }
            }
        }

        // Obtener el segundo personaje
        let character2;
        if (players.has(p2)) {
            character2 = players.get(p2);
        } else {
            // Buscar enemigo en todas las habitaciones
            for (const room of world.rooms) {
                const enemy = room.enemies.find(enemy => enemy.id === p2);
                if (enemy) {
                    // Crear un Character temporal para el enemigo
                    character2 = new Character(
                        enemy.id,
                        enemy.type,
                        'enemy',
                        enemy.health,
                        enemy.attack,
                        enemy.defense,
                        enemy.magic,
                        enemy.strength
                    );
                    break;
                }
            }
        }

        if (!character1 || !character2) {
            return res.status(404).json({ error: 'Uno o ambos personajes no encontrados' });
        }

        // Array para almacenar el registro del combate
        const combatLog = [];

        // Determinar quién ataca primero (basado en un atributo aleatorio)
        let attacker = Math.random() > 0.5 ? character1 : character2;
        let defender = attacker === character1 ? character2 : character1;

        // Iterar hasta que uno de los personajes sea derrotado (máximo 20 turnos)
        const maxTurns = 20;
        let turn = 1;

        while (character1.isAlive() && character2.isAlive() && turn <= maxTurns) {
            // Determinar tipo de ataque (físico o mágico)
            const isMagicAttack = Math.random() > 0.7; // 30% de probabilidad de ataque mágico

            let damage;
            if (isMagicAttack) {
                damage = attacker.calculateMagicDamage();
                const actualDamage = defender.takeDamage(damage);

                combatLog.push({
                    turn,
                    attacker: attacker.id,
                    attackType: 'magic',
                    damage: actualDamage,
                    defender: defender.id,
                    defenderHealthRemaining: defender.health
                });
            } else {
                damage = attacker.calculateAttackDamage();
                const actualDamage = defender.takeDamage(damage);

                combatLog.push({
                    turn,
                    attacker: attacker.id,
                    attackType: 'physical',
                    damage: actualDamage,
                    defender: defender.id,
                    defenderHealthRemaining: defender.health
                });
            }

            // Intercambiar roles para el siguiente turno
            const temp = attacker;
            attacker = defender;
            defender = temp;

            turn++;
        }

        // Determinar el resultado del combate
        let winner, loser;
        if (!character1.isAlive()) {
            winner = character2;
            loser = character1;
        } else if (!character2.isAlive()) {
            winner = character1;
            loser = character2;
        }

        // Si hay un ganador claro
        if (winner && loser) {
            // Si el ganador es un jugador, otorgar experiencia
            if (winner.type === 'player' && players.has(winner.id)) {
                const player = players.get(winner.id);
                player.gainExperience(50); // Dar experiencia por victoria

                // Actualizar enemigo en la habitación si corresponde
                for (const room of world.rooms) {
                    const enemyIndex = room.enemies.findIndex(enemy => enemy.id === loser.id);
                    if (enemyIndex !== -1) {
                        // Actualizar salud del enemigo en la habitación
                        room.enemies[enemyIndex].health = loser.health;
                        break;
                    }
                }
            }

            // Si el perdedor es un jugador, actualizar sus stats
            if (loser.type === 'player' && players.has(loser.id)) {
                const player = players.get(loser.id);
                player.health = loser.health;
            }
        } else {
            // Empate - actualizar la salud de ambos
            if (character1.type === 'player' && players.has(character1.id)) {
                players.get(character1.id).health = character1.health;
            }

            if (character2.type === 'player' && players.has(character2.id)) {
                players.get(character2.id).health = character2.health;
            }

            // Actualizar enemigos en habitaciones si corresponde
            for (const room of world.rooms) {
                // Actualizar enemigo 1 si corresponde
                if (character1.type === 'enemy') {
                    const enemyIndex = room.enemies.findIndex(enemy => enemy.id === character1.id);
                    if (enemyIndex !== -1) {
                        room.enemies[enemyIndex].health = character1.health;
                    }
                }

                // Actualizar enemigo 2 si corresponde
                if (character2.type === 'enemy') {
                    const enemyIndex = room.enemies.findIndex(enemy => enemy.id === character2.id);
                    if (enemyIndex !== -1) {
                        room.enemies[enemyIndex].health = character2.health;
                    }
                }
            }
        }

        // Preparar respuesta
        const result = {
            combatLog,
            finalState: {
                [character1.id]: {
                    health: character1.health,
                    isAlive: character1.isAlive()
                },
                [character2.id]: {
                    health: character2.health,
                    isAlive: character2.isAlive()
                }
            },
            winner: winner ? winner.id : 'empate'
        };

        res.json(result);
    },

    /**
     * Actualiza los atributos de un personaje (curación o cambios)
     * @param {Object} req - Objeto de solicitud
     * @param {Object} res - Objeto de respuesta
     */
    updateCharacterAttributes: (req, res) => {
        const characterId = req.params.idPersonaje;
        const newAttributes = req.body;

        // Buscar si es un jugador
        if (players.has(characterId)) {
            const player = players.get(characterId);
            player.updateAttributes(newAttributes);

            return res.json({
                message: 'Atributos actualizados correctamente',
                character: {
                    id: player.id,
                    name: player.name,
                    health: player.health,
                    maxHealth: player.maxHealth,
                    attack: player.attack,
                    defense: player.defense,
                    magic: player.magic,
                    strength: player.strength
                }
            });
        }

        // Buscar si es un enemigo en alguna habitación
        let enemyFound = false;

        for (const room of world.rooms) {
            const enemyIndex = room.enemies.findIndex(enemy => enemy.id === characterId);

            if (enemyIndex !== -1) {
                // Actualizar atributos del enemigo
                Object.keys(newAttributes).forEach(attr => {
                    if (['health', 'attack', 'defense', 'magic', 'strength'].includes(attr)) {
                        room.enemies[enemyIndex][attr] = newAttributes[attr];
                    }
                });

                enemyFound = true;

                return res.json({
                    message: 'Atributos del enemigo actualizados correctamente',
                    character: room.enemies[enemyIndex]
                });
            }
        }

        if (!enemyFound) {
            return res.status(404).json({ error: 'Personaje no encontrado' });
        }
    }
};

module.exports = combatController;