const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization'); // Get the Authorization header
  console.log(`Auth middleware triggered for ${req.path}`);
  console.log('Authorization Header:', authHeader); // Debug log

  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"
  console.log('Extracted Token:', token); // Debug log

  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    console.log('Decoded Token:', decoded); // Debug log
    req.user = decoded; // Attach decoded user info to the request object
    next(); // Pass control to the next middleware
  } catch (err) {
    console.error('JWT Verification Error:', err.message); // Debug log
    res.status(400).json({ error: 'Token is not valid' });
  }
};

module.exports = auth;

