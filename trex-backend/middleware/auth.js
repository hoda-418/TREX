const jwt = require('jsonwebtoken');

/**
 * Middleware to protect admin routes.
 * Expects a valid JWT in the 'x-auth-token' header.
 * If valid, attaches the user ID to req.user and calls next().
 * If not, sends 401.
 */
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId; // Save user ID for later use
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};