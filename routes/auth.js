/*
*external imports
*/
const express = require('express');
/*
*internal imports
*/
const {registerNewUser,loginUser} = require('../controller/UserController');
const thumbnailUpload = require('../middlewares/avatarUpload');

//initializing router
const router = express.Router();

//register new user
router.post('/register',thumbnailUpload('avatars'),registerNewUser);

//login user
router.post('/login',loginUser);

//logout user




//exporting module
module.exports = router;