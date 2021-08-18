/*
*external imports
*/
const express = require('express');
/*
*internal imports
*/
const {updateUser,deleteUser} = require('../controller/UserController');


//initializing router
const router = express.Router();

//user route
router.put('/:id',updateUser);
router.delete('/:id',deleteUser);

//exporting module
module.exports = router;