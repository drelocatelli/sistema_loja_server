const jwt = require('jsonwebtoken');

const authMiddleware = (resolver) => (parent, args, context, info) => {
    console.log({context})
    const token = context.req.headers.authorization?.split(' ')[1]; // Supondo que o token esteja no formato 'Bearer <token>'
  
    if (!token) {
      throw new Error('Token necessário');
    }
  
    try {
      const decoded = jwt.verify(token, secret);
      context.user = decoded; // Armazena o usuário no contexto para uso posterior
      return resolve(parent, args, context, info); // Prossegue com a execução da operação
    } catch (err) {
      throw new Error('Token inválido');
    }
  };
  

module.exports = authMiddleware;