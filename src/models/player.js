const Character = require('./character');

/**
 * Modelo para representar a un jugador
 * @extends Character
 */
class Player extends Character {
    constructor(id, name, initialRoom = '0-0') {
        // Inicializar con valores base
        super(id, name, 'player', 100, 15, 10, 10, 15);

        // Propiedades específicas del jugador
        this.currentRoom = initialRoom;
        this.inventory = [];
        this.experience = 0;
        this.level = 1;
        this.gold = 0;
    }

    /**
     * Mueve al jugador a una nueva habitación
     * @param {string} roomId - ID de la habitación destino
     * @returns {boolean} - true si el movimiento fue exitoso, false si no
     */
    moveToRoom(roomId) {
        this.currentRoom = roomId;
        return true;
    }

    /**
     * Añade un objeto al inventario del jugador
     * @param {Object} item - Objeto a añadir
     */
    addItemToInventory(item) {
        this.inventory.push(item);
    }

    /**
     * Elimina un objeto del inventario del jugador
     * @param {string} itemId - ID del objeto a eliminar
     * @returns {Object|null} - El objeto eliminado o null si no existe
     */
    removeItemFromInventory(itemId) {
        const index = this.inventory.findIndex(item => item.id === itemId);
        if (index !== -1) {
            const [removedItem] = this.inventory.splice(index, 1);
            return removedItem;
        }
        return null;
    }

    /**
     * Aumenta la experiencia del jugador y sube de nivel si corresponde
     * @param {number} exp - Cantidad de experiencia a añadir
     */
    gainExperience(exp) {
        this.experience += exp;
        // Comprobar si debe subir de nivel (cada 100 puntos de experiencia)
        const newLevel = Math.floor(this.experience / 100) + 1;
        if (newLevel > this.level) {
            this.levelUp(newLevel);
        }
    }

    /**
     * Sube de nivel al jugador y aumenta sus estadísticas
     * @param {number} newLevel - Nuevo nivel del jugador
     */
    levelUp(newLevel) {
        const levelDiff = newLevel - this.level;

        // Aumentar estadísticas según la diferencia de niveles
        this.health += 10 * levelDiff;
        this.maxHealth += 10 * levelDiff;
        this.attack += 2 * levelDiff;
        this.defense += 1 * levelDiff;
        this.magic += 2 * levelDiff;
        this.strength += 2 * levelDiff;

        this.level = newLevel;
    }

    /**
     * Obtiene información completa del jugador
     * @returns {Object} - Datos del jugador
     */
    getInfo() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            health: this.health,
            maxHealth: this.maxHealth,
            attack: this.attack,
            defense: this.defense,
            magic: this.magic,
            strength: this.strength,
            level: this.level,
            experience: this.experience,
            gold: this.gold,
            currentRoom: this.currentRoom,
            inventory: this.inventory
        };
    }
}

// Almacenamiento en memoria para jugadores
const players = new Map();

// Crear un jugador por defecto
const defaultPlayer = new Player('player1', 'Aventurero');
players.set(defaultPlayer.id, defaultPlayer);

module.exports = {
    Player,
    players
};