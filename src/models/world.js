/**
 * Modelo para el mundo virtual del juego
 * Implementa un array bidimensional que representa las habitaciones
 */
class World {
    constructor(width = 5, height = 5) {
        this.width = width;
        this.height = height;
        this.rooms = [];
        this.visitedRooms = new Set(); // Conjunto para almacenar IDs de habitaciones visitadas

        // Inicializar el mundo
        this.initializeWorld();
    }

    /**
     * Inicializa el mundo con habitaciones aleatorias
     */
    initializeWorld() {
        // Tipos de habitaciones posibles
        const roomTypes = ['sala', 'dormitorio', 'cocina', 'biblioteca', 'mazmorra', 'cripta', 'tesoro', 'armería'];
        // Tipos de enemigos posibles
        const enemyTypes = ['goblin', 'orco', 'esqueleto', 'zombie', 'demonio', 'dragón', 'espectro', 'troll'];
        // Tipos de objetos posibles
        const itemTypes = ['espada', 'escudo', 'poción', 'daga', 'arco', 'grimorio', 'gema', 'llave', 'monedas'];

        // Crear cada habitación del mundo
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const roomId = `${x}-${y}`;
                const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];

                // Crear enemigos aleatorios (0-2 enemigos por habitación)
                const enemies = [];
                const enemyCount = Math.floor(Math.random() * 3);
                for (let i = 0; i < enemyCount; i++) {
                    const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
                    enemies.push({
                        id: `enemy-${roomId}-${i}`,
                        type: enemyType,
                        health: Math.floor(Math.random() * 50) + 50, // Salud entre 50 y 100
                        attack: Math.floor(Math.random() * 15) + 5,  // Ataque entre 5 y 20
                        defense: Math.floor(Math.random() * 10) + 1, // Defensa entre 1 y 10
                        magic: Math.floor(Math.random() * 20),       // Magia entre 0 y 20
                        strength: Math.floor(Math.random() * 15) + 5 // Fuerza entre 5 y 20
                    });
                }

                // Crear objetos aleatorios (0-3 objetos por habitación)
                const items = [];
                const itemCount = Math.floor(Math.random() * 4);
                for (let i = 0; i < itemCount; i++) {
                    const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
                    items.push({
                        id: `item-${roomId}-${i}`,
                        type: itemType,
                        value: Math.floor(Math.random() * 100) + 1
                    });
                }

                // Crear la habitación
                const room = {
                    id: roomId,
                    coordinates: { x, y },
                    type: roomType,
                    name: `${roomType.charAt(0).toUpperCase() + roomType.slice(1)} ${x}-${y}`,
                    description: `Una ${roomType} misteriosa. Coordenadas: ${x}-${y}`,
                    enemies,
                    items
                };

                // Agregar la habitación al mundo
                this.rooms.push(room);
            }
        }
    }

    /**
     * Obtiene una habitación por sus coordenadas
     * @param {number} x - Coordenada X
     * @param {number} y - Coordenada Y
     * @returns {Object|null} - La habitación o null si no existe
     */
    getRoomByCoordinates(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        return this.rooms.find(room => room.coordinates.x === x && room.coordinates.y === y);
    }

    /**
     * Obtiene una habitación por su ID
     * @param {string} roomId - ID de la habitación (formato: "x-y")
     * @returns {Object|null} - La habitación o null si no existe
     */
    getRoomById(roomId) {
        return this.rooms.find(room => room.id === roomId);
    }

    /**
     * Marca una habitación como visitada
     * @param {string} roomId - ID de la habitación
     */
    markRoomAsVisited(roomId) {
        this.visitedRooms.add(roomId);
    }

    /**
     * Verifica si una habitación ha sido visitada
     * @param {string} roomId - ID de la habitación
     * @returns {boolean} - true si ha sido visitada, false si no
     */
    isRoomVisited(roomId) {
        return this.visitedRooms.has(roomId);
    }

    /**
     * Obtiene todas las habitaciones visitadas
     * @returns {Array} - Lista de habitaciones visitadas
     */
    getVisitedRooms() {
        return this.rooms.filter(room => this.visitedRooms.has(room.id));
    }

    /**
     * Verifica si dos habitaciones son adyacentes
     * @param {string} roomId1 - ID de la primera habitación
     * @param {string} roomId2 - ID de la segunda habitación
     * @returns {boolean} - true si son adyacentes, false si no
     */
    areRoomsAdjacent(roomId1, roomId2) {
        const room1 = this.getRoomById(roomId1);
        const room2 = this.getRoomById(roomId2);

        if (!room1 || !room2) return false;

        const xDiff = Math.abs(room1.coordinates.x - room2.coordinates.x);
        const yDiff = Math.abs(room1.coordinates.y - room2.coordinates.y);

        // Son adyacentes si están a una unidad de distancia en solo una dimensión
        return (xDiff === 1 && yDiff === 0) || (xDiff === 0 && yDiff === 1);
    }
}

// Instancia única del mundo (patrón Singleton)
const worldInstance = new World();

module.exports = worldInstance;