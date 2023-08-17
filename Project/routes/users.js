const express = require('express');
const router = express.Router();
const bcrypt=require('bcryptjs')
const crypto=require("crypto")
const Token=require('../models/token')
const sendEmail=require('../utils/sendEmail.js')
const User = require('../models/User')
// Load User Controller
const userController = require('../controllers/user.controller')
const reviewController = require('../controllers/review.controller')
const { forwardAuthenticated } = require('../config/auth');
const req = require('express/lib/request');

//Register Routes
// Login Page
router.get('/login', forwardAuthenticated, userController.login);
// Register Page
router.get('/register', forwardAuthenticated, userController.register);

// Register
router.post('/register', userController.registerUser);

// Login
router.post('/login', userController.loginUser);

// Logout
router.get('/logout', userController.logout);

//review
router.get('/reviews',reviewController.all);

//forgotPassword
router.get('/forgotPassword', (req, res) =>
res.render("forgotPassword", {
  layout: "layouts/layout"
})
);

let mail;
router.post('/forgotPassword', (req, res) => {
    const { email } = req.body;
    let errors = [];

    if (!email) {
        errors.push({ msg: 'Please enter E-Mail' });
    }

    if (errors.length > 0) {
        res.render('forgotPassword', {
            errors,
            email
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (!user) {
                errors.push({ msg: 'Email doesnot exists' });
                res.render('forgotPassword', {
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
                res.render('successEmail');
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
        res.redirect('/users/resetPassword');
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});


//resetPassword
router.get('/resetPassword', (req, res) =>
res.render("resetPassword", {
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
        res.render('resetPassword', {
            errors,
            password,
            password2
        });
    } else {
        User.findOne({ email: mail }).then(user => {
            if (!user) {
                errors.push({ msg: 'Email doesnot exists' });
                res.render('resetPassword', {
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
                        res.redirect('/users/login');
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
        res.redirect('/users/login');
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
  });

module.exports = router;
