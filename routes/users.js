const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync')
const users = require('../controllers/users');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/register')
    .get(users.registerFormRender)
    .post(upload.single('image'), catchAsync(users.registerNewUser))

router.route('/login')
    .get(users.loginPage)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.verifyUser)

router.get('/logout', users.logoutUser);

module.exports = router;