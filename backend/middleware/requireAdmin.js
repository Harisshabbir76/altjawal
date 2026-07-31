const jwt = require('jsonwebtoken');

module.exports = function requireAdmin(req, res, next) {
  const token = req.cookies?.admin_token;
  if (!token) return res.status(404).json({ message: 'Not found.' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload.admin) return res.status(404).json({ message: 'Not found.' });
    next();
  } catch {
    return res.status(404).json({ message: 'Not found.' });
  }
};
