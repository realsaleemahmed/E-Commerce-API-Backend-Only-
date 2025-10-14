//admin middleware

const isAdminUser = (req, res, next) => {
  if(req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Admins only.'
  })
};

module.exports = isAdminUser;