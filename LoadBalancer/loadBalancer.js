const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Para verificar el estado del servidor

const app = express();
const PORT = 3000; // Puerto del middleware

app.use(cors());
app.use(express.json());

// Lista de servidores como variable de entorno
const servers = process.env.SERVERS ? process.env.SERVERS.split(',') : ['http://localhost:3001', 'http://localhost:3002'];
let requestCount = new Map(); // Mapa para contar las solicitudes por servidor

// Inicializar el conteo de peticiones para cada servidor
servers.forEach(server => requestCount.set(server, 0));

// Resetear el conteo de peticiones cada minuto
setInterval(() => {
    console.log('Reiniciando el conteo de solicitudes...');
    servers.forEach(server => requestCount.set(server, 0)); // Resetear a 0 cada minuto
}, 60000);

// Función para verificar si un servidor está disponible
const checkServerStatus = async (url) => {
    try {
        await axios.get(`${url}/healthcheck`);
        return true;
    } catch (error) {
        return false;
    }
};

// Middleware para redirigir la solicitud al servidor menos ocupado
app.post('/count-tokens', async (req, res) => {
    let leastLoadedServer = null;
    let minRequests = Infinity;

    // Verificar cuál servidor tiene menos solicitudes y está disponible
    for (const server of servers) {
        const isAvailable = await checkServerStatus(server);
        if (isAvailable && requestCount.get(server) < minRequests) {
            leastLoadedServer = server;
            minRequests = requestCount.get(server);
        }
    }

    if (!leastLoadedServer) {
        return res.status(503).json({ error: 'Ambos servidores están caídos' });
    }

    // Redirigir la solicitud al servidor menos ocupado
    try {
        const response = await axios.post(`${leastLoadedServer}/count-tokens`, req.body);
        requestCount.set(leastLoadedServer, requestCount.get(leastLoadedServer) + 1); // Incrementar el conteo de solicitudes
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor al procesar la solicitud' });
    }
});

// Iniciar el middleware en el puerto 3000
app.listen(PORT, () => {
    console.log(`Middleware corriendo en http://localhost:${PORT}`);
});
