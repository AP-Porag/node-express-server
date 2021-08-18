/*
*external imports
*/

/*
*internal imports
*/
const Category = require('../models/Category');

//create category
async function addNewCategory(req, res, next) {
    //try to data to category table
    let newCategory;
    if (req.files && req.files.length > 0){
        newCategory = new Category({
            title:req.body.title,
            thumbnail:`${process.env.BASE_URL}categories/${req.files[0].filename}`,
        });
    }else {
        newCategory = new Category({
            title:req.body.title,
        });
    }
    try {
        const category = await newCategory.save();
        res.status(200).json('category created successfully. => ' + category)
    }catch (e) {
        res.status(500).json(e)
    }
}

//get single category
async function getSingleCategory(req, res, next) {
    try {
        const category = await Category.findById(req.params.id);
        if (category){
            res.status(200).json(category);
        }else {
            res.status(401).json("there is no related category");
        }
    }catch (e) {
        res.status(500).json("there is a server error");
        console.log(e)
    }
}

//get all category
async function getAllCategory(req, res, next) {
    const category = req.query.cat;

    try {
        let categories = await Category.find(); ;

        
        res.status(200).json(categories);
    }catch (e) {
        res.status(500).json("there is a server error");
        console.log(e)
    }
}
//update category
async function updateCategory(req, res, next) {

    try {
        const category = await Category.findById(req.params.id);

        if (category){

            try {
                const updateCategory = await Category.findByIdAndUpdate(req.params.id,{
                    $set:req.body,
                },{
                    new:true
                });

                res.status(200).json("category updated successfully");
            }catch (e) {
                res.status(500).json("there is an error to update category");
                console.log(e)
            }
        }else {
            res.status(401).json("there is no related category");
        }
    }catch (e) {
        res.status(500).json("there is a server error");
        console.log(e)
    }

}
//delete category
async function deleteCategory(req, res, next) {
    try {
        const category = await Category.findById(req.params.id);

        if (category){
            try {
                await category.delete();
                res.status(200).json("category Deleted successfully");
            }catch (e) {
                res.status(500).json("there is an error to Delete category");
                console.log(e)
            }
        }else {
            res.status(401).json("You can delete only your category");
        }
    }catch (e) {
        res.status(500).json("there is a server error");
        console.log(e)
    }

}

module.exports = {
    addNewCategory,
    getSingleCategory,
    getAllCategory,
    updateCategory,
    deleteCategory
}
