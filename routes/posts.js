/*
*external imports
*/
const express = require('express');
/*
*internal imports
*/
const {addNewPost,getSinglePost,getAllPost,updatePost,deletePost} = require('../controller/PostController');
const thumbnailUpload = require('../middlewares/avatarUpload');


//initializing router
const router = express.Router();

//post routes
router.post('/',thumbnailUpload('posts'),addNewPost);
router.get('/:id',getSinglePost);
router.get('/',getAllPost);
router.put('/:id',updatePost);
router.delete('/:id',deletePost);

//exporting module
module.exports = router;