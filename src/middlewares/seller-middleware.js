// seller middleware

const isSellerUser = (req, res, next) => {
  if(req.user && req.user.role === 'seller') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Sellers only.'
  })
};

module.exports = isSellerUser;