const express = require('express');
const app = express();

// Configurar los encabezados CORS
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site'); // o 'cross-origin' según sea necesario
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless'); // o 'require-corp' según sea necesario
  next();
});

// Resto de la configuración del servidor...

// Rutas y middleware del servidor...

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
