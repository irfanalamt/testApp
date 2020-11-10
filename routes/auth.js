module.exports = {

    ensureAuthenticatedUser: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please Login first!');
      res.redirect('/users/login');
    },
    forwardAuthenticatedUser: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/dashboard');      
    }
    , ensureAuthenticatedPro: function(req,res,next){
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please Login first!');
      res.redirect('/pro/loginPro');
    }
  };