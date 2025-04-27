/**
 * Clase base para todos los personajes del juego (jugadores y enemigos)
 */
class Character {
    /**
     * Constructor del personaje
     * @param {string} id - Identificador único del personaje
     * @param {string} name - Nombre del personaje
     * @param {string} type - Tipo de personaje
     * @param {number} health - Salud actual y máxima inicial
     * @param {number} attack - Valor de ataque
     * @param {number} defense - Valor de defensa
     * @param {number} magic - Valor de magia
     * @param {number} strength - Valor de fuerza
     */
    constructor(id, name, type, health = 100, attack = 10, defense = 5, magic = 5, strength = 10) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.health = health;
        this.maxHealth = health;
        this.attack = attack;
        this.defense = defense;
        this.magic = magic;
        this.strength = strength;
    }

    /**
     * Recibe daño
     * @param {number} damage - Cantidad de daño a recibir
     * @returns {number} - Daño real recibido después de la defensa
     */
    takeDamage(damage) {
        // El daño se reduce por la defensa, con un mínimo de 1
        const actualDamage = Math.max(1, damage - this.defense);
        this.health = Math.max(0, this.health - actualDamage);
        return actualDamage;
    }

    /**
     * Recupera salud
     * @param {number} amount - Cantidad de salud a recuperar
     * @returns {number} - Cantidad real de salud recuperada
     */
    heal(amount) {
        const previousHealth = this.health;
        this.health = Math.min(this.maxHealth, this.health + amount);
        return this.health - previousHealth;
    }

    /**
     * Calcula el daño de ataque considerando atributos
     * @returns {number} - Daño de ataque calculado
     */
    calculateAttackDamage() {
        const baseDamage = this.attack;
        const strengthBonus = this.strength * 0.5;

        // Factor aleatorio para variar el daño (entre 0.8 y 1.2)
        const randomFactor = 0.8 + (Math.random() * 0.4);

        return Math.floor((baseDamage + strengthBonus) * randomFactor);
    }

    /**
     * Calcula el daño mágico considerando atributos
     * @returns {number} - Daño mágico calculado
     */
    calculateMagicDamage() {
        const baseDamage = this.magic * 1.2;

        // Factor aleatorio para variar el daño (entre 0.7 y 1.3)
        const randomFactor = 0.7 + (Math.random() * 0.6);

        return Math.floor(baseDamage * randomFactor);
    }

    /**
     * Verifica si el personaje está vivo
     * @returns {boolean} - true si está vivo, false si no
     */
    isAlive() {
        return this.health > 0;
    }

    /**
     * Actualiza los atributos del personaje
     * @param {Object} attributes - Nuevos atributos a establecer
     */
    updateAttributes(attributes) {
        // Solo actualiza las propiedades válidas
        const validProperties = ['name', 'health', 'maxHealth', 'attack', 'defense', 'magic', 'strength'];

        for (const [key, value] of Object.entries(attributes)) {
            if (validProperties.includes(key) && value !== undefined) {
                this[key] = value;
            }
        }

        // Asegurar que la salud no supere el máximo
        this.health = Math.min(this.health, this.maxHealth);
    }
}

module.exports = Character;