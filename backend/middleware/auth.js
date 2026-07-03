// Protect admin routes
const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect('/admin/login');
};

// Redirect if already logged in
const redirectIfAuth = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return res.redirect('/admin/dashboard');
  }
  next();
};

module.exports = { requireAuth, redirectIfAuth };
