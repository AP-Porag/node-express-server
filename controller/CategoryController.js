/*
*external imports
*/
const {google} = require('googleapis');
const fs = require('fs');
/*
*internal imports
*/
const Category = require('../models/Category');

//create category
async function addNewCategory(req, res, next) {
    let newThumbnail;
    //uploading image to google drive start

    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    oAuth2Client.setCredentials({refresh_token:process.env.GOOGLE_REFRESH_TOKEN});

    const drive = google.drive({
        version:"v3",
        auth:oAuth2Client
    });
    const filePath = req.files[0].path;
    const mimetype = req.files[0].mimetype;
    try {
        const response = await drive.files.create({
            requestBody:{
                name:req.files[0].originalname,
                mimeType:mimetype,
                parents: ['1MxIU_ADWO0cHZclAGpYlRcQR6D0K_VWf']
            },
            media:{
                mimeType:mimetype,
                body:fs.createReadStream(filePath)
            }
        });

        if (response.data.id){
            try {
                const fileId = response.data.id;

                await drive.permissions.create({
                    fileId:fileId,
                    requestBody:{
                        role:'reader',
                        type:'anyone'
                    }
                });
                const result = await drive.files.get({
                    fileId:fileId,
                    fields:'webViewLink,webContentLink'
                });
                newThumbnail = result.data.webViewLink;
            }catch (e) {
                console.log(e.message)
            }
        }
    }catch (e) {
        console.log(e.message)
    }

    //uploading image to google drive end



    //try to data to category table
    let newCategory;
    if (req.files && req.files.length > 0){
        newCategory = new Category({
            title:req.body.title,
            thumbnail:newThumbnail,
        });

        if (newCategory){
            fs.unlinkSync(filePath);
        }
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
        let categories = await Category.find().sort({ createdAt: 'desc'}); ;

        
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
