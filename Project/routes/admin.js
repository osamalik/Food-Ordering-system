const express = require("express");
const Product = require("../models/addProduct");
const router = express.Router();
const bcrypt=require('bcryptjs')
const crypto=require("crypto")
const Token=require('../models/token')
const User = require('../models/User')
const adminController = require('../controllers/admin.controller');
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

router.get("/addProduct", ensureAuthenticated,(req, res) => {
  res.render("adminUI/addProduct", {
    user: req.user,
    layout: "layouts/Layout",
  });
});

router.get("/admin/:page", ensureAuthenticated, async (req, res, next) => {
    var perPage = 3;
    var page = req.params.page || 1;
  
    Product.find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, prod) {
        Product.count().exec(function(err, count){
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        } else {
            res.render("adminUI/admin", {
                user: req.user,
                layout: "layouts/layout",
                prod,
                current: page,
                pages: Math.ceil(count / perPage) 
            })
        }
       })
    });
  
});
  

router.get("/update_product", ensureAuthenticated, (req, res) => {
  Product.findById(req.query.id, function (err, prod) {
    if (err) {
      console.log(err);
    }
    res.render("adminUI/update_product", {
      user: req.user,
      prod,
      layout: "layouts/Layout",
    });
  });
});

router.get("/adminDashBoard", ensureAuthenticated, (req, res) => {
  res.render("adminUI/adminDashBoard", {
    user: req.user,
    layout: "layouts/Layout",
  });
});

//admin Login Page
router.get('/admin_Login', forwardAuthenticated, adminController.login);
//admin Register Page
router.get('/admin_Register', forwardAuthenticated, adminController.register);

//admin Register
router.post('/admin_Register', adminController.registerUser);

//admin Login
router.post('/admin_Login', adminController.loginUser);

//forgotPassword
router.get('/adminForgotPassword', (req, res) =>
res.render("adminUI/adminForgotPassword", {
  user: req.user,
  layout: "layouts/layout"
})
);

let mail;
router.post('/adminForgotPassword', (req, res) => {
    const { email } = req.body;
    let errors = [];

    if (!email) {
        errors.push({ msg: 'Please enter E-Mail' });
    }

    if (errors.length > 0) {
        res.render('adminUI/adminForgotPassword', {
            errors,
            email
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (!user) {
                errors.push({ msg: 'Email doesnot exists' });
                res.render('adminUI/adminForgotPassword', {
                    errors,
                    email
                });
            } else {
                const tok = crypto.randomBytes(32).toString("hex");
                const token = new Token({
                    userId: user._id,
                    token: tok,
                }).save();
                const url = `http://localhost:5000/users/forgotPassword/${user.id}/verify/${tok}`;
                sendEmail(user.email, "Change Password", url);
                res.render('adminUI/adminSuccessEmail');
            }
        });
    }
});

router.get("/forgotPassword/:id/verify/:token/", async(req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send({ message: "Invalid link" });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send({ message: "Invalid link" });
        await token.remove();
        var string = encodeURIComponent(user.email);
         mail = user.email;
        res.redirect('/adminUI/adminResetPassword');
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});


//resetPassword
router.get('/resetPassword', (req, res) =>
res.render("adminUI/resetPassword", {
  user: req.user,
  layout: "layouts/layout"
})
);

router.post('/resetPassword', (req, res) => {
    const { password, password2 } = req.body;
    let errors = [];

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('adminUI/resetPassword', {
            errors,
            password,
            password2
        });
    } else {
        User.findOne({ email: mail }).then(user => {
            if (!user) {
                errors.push({ msg: 'Email doesnot exists' });
                res.render('adminUI/resetPassword', {
                    errors,
                    password,
                    password2
                });
            } else {
                let pass = password;
                async function main() {
                    await user.updateOne({password: pass });
                }
                
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {

                        if (err) console.log("error");
                        pass = hash;
                        main();
                        req.flash('success_msg', 'Password Changed');
                        res.redirect('/adminUI/admin_Login');
                    });
                });

            }
        });
    }
});


//sendEmail
router.get("/:id/verify/:token/", async(req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send({ message: "Invalid link" });
  
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send({ message: "Invalid link" });
  
        await User.updateOne({ _id: user._id, verified: true });
        await token.remove();
        req.flash(
            'success_msg',
            'E-Mail Verified'
        );
        res.redirect('/adminUI/admin_Login');
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
  });
module.exports = router;
