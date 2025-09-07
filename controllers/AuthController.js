const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const Token = require('../models/Token');

const HASH_SALT_ROUNDS = 10;

exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).send('Todos los campos son obligatorios.');
  }

  const existingUser = User.findByUsernameOrEmail(username);
  if (existingUser) {
    return res.status(409).send('Usuario o correo ya registrado.');
  }

  const hashedPassword = await bcrypt.hash(password, HASH_SALT_ROUNDS);
  User.create(username, hashedPassword, email);
  res.status(201).send('Registro exitoso.');
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = User.findByUsernameOrEmail(username);
  if (!user) {
    return res.status(404).send('Usuario no encontrado.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).send('Credenciales incorrectas.');
  }
  res.status(200).send('Login exitoso.');
};

exports.requestPasswordReset = (req, res) => {
  const { identifier } = req.body;
  const user = User.findByUsernameOrEmail(identifier);
  if (!user) {
    return res.status(404).send('La cuenta no existe.');
  }

  const token = crypto.randomBytes(32).toString('hex');
  Token.create(user.id, token);

  // En la vida real, se enviaría un correo aquí
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  console.log(`Enlace de recuperación para ${user.email}: ${resetLink}`);
  res.status(200).send('Enlace de recuperación enviado.');
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).send('Token y nueva contraseña son obligatorios.');
  }

  const tokenData = Token.findByToken(token);
  if (!tokenData || tokenData.status === 'used' || tokenData.expiresAt < Date.now()) {
    return res.status(400).send('Token inválido o expirado.');
  }

  // LÍNEA ACTUALIZADA: Ahora usa findById para buscar al usuario por su ID
  const user = User.findById(tokenData.userId);
  if (!user) {
    return res.status(404).send('Usuario no encontrado.');
  }

  const newHashedPassword = await bcrypt.hash(password, HASH_SALT_ROUNDS);
  User.updatePassword(user, newHashedPassword);
  Token.markAsUsed(token);

  res.status(200).send('Contraseña actualizada con éxito. ¡Intenta iniciar sesión!');
};