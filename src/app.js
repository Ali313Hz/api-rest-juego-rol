const express = require('express');
const cors = require('cors');
const playerRoutes = require('./routes/playerRoutes');
const roomRoutes = require('./routes/roomRoutes');
const combatRoutes = require('./routes/combatRoutes');
const authRoutes = require('./routes/authRoutes');

// Inicializar app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/jugador', playerRoutes);
app.use('/habitaciones', roomRoutes);
app.use('/combate', combatRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a la API del juego de rol',
        endpoints: {
            jugador: '/jugador',
            habitaciones: '/habitaciones',
            combate: '/combate'
        }
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;