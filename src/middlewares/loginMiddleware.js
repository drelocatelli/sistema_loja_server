const jwt = require('jsonwebtoken');

const authMiddleware = (resolve) => (parent, args, context, info) => {
    const token = context.req.headers.authorization?.split(' ')[1]; 

    if (!token) {
      throw new Error('É necessário estar autenticado');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      context.user = decoded; // Armazena o usuário no contexto para uso posterior
      return resolve(parent, args, context, info); // Prossegue com a execução da operação
    } catch (err) {
      throw new Error('Sessão expirada. Faça login novamente.');
    }
  };

module.exports = authMiddleware;