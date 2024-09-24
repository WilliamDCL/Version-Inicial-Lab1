const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.get('/healthcheck', (req, res) => {
    res.status(200).json({ status: 'OK' });
});


// Endpoint que recibe el texto y devuelve el número de tokens
app.post('/count-tokens', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'No se envió ningún texto.' });
  }
  const tokens = text.trim().split(/\s+/).length; // Divide el texto en tokens por espacio
  res.json({ tokens });
});

app.listen(PORT, () => {
  console.log(`Servidor 1 corriendo en http://localhost:${PORT}`);
});
