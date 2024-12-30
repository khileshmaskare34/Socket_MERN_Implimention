// authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  if (!token) return res.status(401).send('Token not provided'); // If token is missing

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).send('Invalid token');
    }

    console.log("decoded_id", decoded.id)
    req.userId = decoded.id; // Attach user ID to request object for use in subsequent handlers
    next(); // Pass control to the next handler
  });
};

module.exports = verifyToken;
