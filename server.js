const express = require('express');
const app = express();
const PORT = 3000;

// Importa el controlador
const AuthController = require('./controllers/AuthController');

// Middleware para procesar peticiones JSON
app.use(express.json());

// Rutas
app.post('/register', AuthController.register);
app.post('/login', AuthController.login);
app.post('/forgot-password', AuthController.requestPasswordReset);
app.post('/reset-password', AuthController.resetPassword);

app.listen(PORT, () => {
  console.log(`Servidor de autenticación escuchando en http://localhost:${PORT}`);
});