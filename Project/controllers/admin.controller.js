const bcrypt = require("bcryptjs");
const passport = require("passport");
const adminUser = require("../models/adminUser");
const Admin = require("../models/adminUser");

//Login Function
exports.login = (req, res) =>
  res.render("adminUI/admin_Login", {
    layout: "layouts/layout"
  });

//Register Funcion
exports.register = (req, res) =>
  res.render("adminUI/admin_Register", {
    layout: "layouts/layout"
  });

//Handle Post Request to add a new user
exports.registerUser = (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
     Admin.findOne({ email: email }).then(admin => {
      if (admin) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newAdmin = new adminUser({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) throw err;
            newAdmin.password = hash;
            newAdmin
              .save()
              .then(admin => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/adminUI/admin_Login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
};

//Handle post request to Login a user
exports.loginUser = (req, res, next) => {
  passport.authenticate("admin", {
    successRedirect: "/adminUI/admin/1",
    failureRedirect: "/adminUI/admin_Login",
    failureFlash: true
  })(req, res, next);
};

// Logout already logined user
exports.logout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/adminUI/admin_Login");
};
