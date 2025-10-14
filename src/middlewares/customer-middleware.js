//customer middleware

const isCustomerUser = (req, res, next) => {
  if(req.user && req.user.role ==='customer') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Customers only.'
  })
};

module.exports = isCustomerUser;