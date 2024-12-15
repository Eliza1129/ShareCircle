const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
  // Extract the Authorization header
  const authHeader = req.header('Authorization');
  console.log(`Auth middleware triggered for ${req.path}`);
  console.log('Authorization Header:', authHeader);

  // Check if the Authorization header is missing
  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];
  console.log('Extracted Token:', token);

  // Check if the token is missing
  if (!token) {
    return res.status(401).json({ error: 'Token is missing. You must be logged in to post an item.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Pass control to the next middleware or route handler
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    return res.status(401).json({ error: 'Invalid token. Please log in again.' });
  }
};

module.exports = auth;


