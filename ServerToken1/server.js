const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001; // Asegúrate de que el puerto está bien configurado

app.use(cors());
app.use(express.json()); // Asegúrate de usar express.json() para poder recibir JSON
app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'OK' });
});


// Endpoint que recibe el texto y devuelve el número de tokens
app.post('/count-tokens', (req, res) => {
    const { text } = req.body; // Asegúrate de que el cliente está enviando correctamente el JSON
    if (!text) {
        return res.status(400).json({ error: 'No se envió ningún texto.' });
    }
    const tokens = text.trim().split(/\s+/).length; // Divide el texto en tokens por espacio
    res.json({ tokens });
});

app.listen(PORT, () => {
    console.log(`Servidor 1 corriendo en http://localhost:${PORT}`);
});
