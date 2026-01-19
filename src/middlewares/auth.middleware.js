const { verifyToken } = require('../utils/jwt');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const err = new Error('Unauthorized');
      err.statusCode = 401;
      throw err;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};

module.exports = { authenticate };
