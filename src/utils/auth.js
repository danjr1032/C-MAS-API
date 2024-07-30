
const jwt = require('jsonwebtoken');
const secret = 'YilMwaghavulshang';

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Access Denied');
    try {
      const verified = jwt.verify(token, secret);
      req.user = verified;
      next();
    } catch (error) {
      res.status(400).send('Invalid Token');
    }
  }
  
  module.exports = { authenticateToken };
