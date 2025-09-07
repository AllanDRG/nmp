const tokens = [];

module.exports = {
  // Simula guardar un nuevo token
  create: (userId, token) => {
    const now = Date.now();
    const newToken = {
      token,
      userId,
      createdAt: now,
      expiresAt: now + 3600000, // Expira en 60 minutos
      status: 'active'
    };
    tokens.push(newToken);
  },
  // Simula buscar un token por su valor
  findByToken: (token) => tokens.find(t => t.token === token),
  // Simula marcar un token como usado
  markAsUsed: (token) => {
    const foundToken = tokens.find(t => t.token === token);
    if (foundToken) {
      foundToken.status = 'used';
    }
  }
};