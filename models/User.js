const users = [];
let nextUserId = 1;

module.exports = {
  // Simula buscar un usuario por email o nombre de usuario
  findByUsernameOrEmail: (identifier) => users.find(
    user => user.username === identifier || user.email === identifier
  ),

  // NUEVA FUNCIÓN: Simula buscar un usuario por su ID
  findById: (id) => users.find(user => user.id === id),

  // Simula guardar un nuevo usuario
  create: (username, password, email) => {
    const newUser = {
      id: nextUserId++,
      username,
      password, // La contraseña se encriptará en el controlador
      email
    };
    users.push(newUser);
    return newUser;
  },

  // Simula actualizar la contraseña de un usuario
  updatePassword: (user, newPassword) => {
    user.password = newPassword;
  }
};