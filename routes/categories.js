/*
*external imports
*/
const express = require('express');
/*
*internal imports
*/
const {addNewCategory,getSingleCategory,getAllCategory,updateCategory,deleteCategory} = require('../controller/CategoryController');
const thumbnailUpload = require('../middlewares/avatarUpload');


//initializing router
const router = express.Router();

//category routes
router.post('/',thumbnailUpload('categories'),addNewCategory);
router.get('/:id',getSingleCategory);
router.get('/',getAllCategory);
router.put('/:id',updateCategory);
router.delete('/:id',deleteCategory);


//exporting module
module.exports = router;