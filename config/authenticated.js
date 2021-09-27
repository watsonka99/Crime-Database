// created by Rikardas Bleda
module.exports = {
    // Authentication to ensure user is logged in
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        role = req.user.role;
        return next();
      }
      req.flash('error_msg', 'User is not logged in');
      res.redirect('/users/login');
    },

    // Authentication to ensure user is of role admin
    ensureAdmin: function(req, res, next) {
      if (req.user.role == "admin") {
        return next();
      }
      req.flash('error_msg', 'User is not permitted to view this page');
      res.redirect('back');
    },

    // Authentication to ensure user is of role information manager
    ensureIM: function(req, res, next) {
      if (req.user.role == "manager") {
        return next();
      }
      req.flash('error_msg', 'User is not permitted to view this page');
      res.redirect('back');
    },
    
    // Authentication to ensure user is not using a temporary password
    ensureSecured: function(req, res, next) {
      if (req.user.confirmed == true) {
        return next();
      }
      req.flash('error_msg', 'Temporary Accounts are not permitted to access the system.');
      res.redirect('/users/passwordChange');
    }
  };