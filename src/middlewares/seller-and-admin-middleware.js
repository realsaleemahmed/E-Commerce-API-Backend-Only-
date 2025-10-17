const isSellerOrAdmin = (req, res, next) => {
  if(req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Admins and Sellers only.'
  });
};

module.exports = {isSellerOrAdmin};
