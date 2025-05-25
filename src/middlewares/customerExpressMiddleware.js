const jwt = require('jsonwebtoken');

const authCustomerMiddlewareExpress = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token necessário' });
  }

  const token = authHeader.split(' ')[1]; // Pega apenas o token

  if (!token) {
    return res.status(401).json({ message: 'Token ausente' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verifica com a chave secreta
    req.user = decoded; // Armazena os dados do usuário no req
    next(); // Passa para o próximo middleware
  } catch (err) {
    console.error('Erro ao verificar token:', err.message);
    return res.status(403).json({ message: 'Sessão expirada. Faça login novamente.' });
  }
};

module.exports = authCustomerMiddlewareExpress;
