/*
*external imports
*/

/*
*internal imports
*/
const Post = require('../models/Post');
const Category = require('../models/Category');

//create category
async function addNewPost(req, res, next) {
    //try to data to category table

    let newPost;
    if (req.files && req.files.length > 0){
        newPost = new Post({
            title:req.body.title,
            description:req.body.description,
            thumbnail:`${process.env.BASE_URL}posts/${req.files[0].filename}`,
            author:req.body.author,
            categories:req.body.categories
        });
    }else {
        newPost = new Post({
            title:req.body.title,
            description:req.body.description,
            thumbnail:req.body.thumbnail,
            author:req.body.author,
            categories:req.body.categories
        });
    }
    try {
        const post = await newPost.save();
        res.status(200).json('post created successfully. => ' + post)
    }catch (e) {
        res.status(500).json(e)
    }
}

//get single post
async function getSinglePost(req, res, next) {
    try {
        const post = await Post.findById(req.params.id);
        if (post){
            res.status(200).json(post);
        }else {
            res.status(401).json("there is no related post");
        }
    }catch (e) {
        res.status(500).json("there is a server error");
        console.log(e)
    }
}

//get all post for a category
async function getAllPost(req, res, next) {
    const user = req.query.user;
    const cat = req.query.cat;

    try {
        let posts ;

        if (user){
            posts = await Post.find({username:user});
        }else if (cat){

            let category =await Category.findById(cat);
            posts = await Post.find({
                categories:{
                    $in:[category.title]
                },
            });
        }else {
            posts = await Post.find();
        }
        res.status(200).json(posts);
    }catch (e) {
        res.status(500).json("there is a server error");
        console.log(e)
    }
}
//update category
async function updatePost(req, res, next) {

    try {
        const post = await Post.findById(req.params.id);

        if (post.author === req.body.author){

            try {
                const updatePost = await Post.findByIdAndUpdate(req.params.id,{
                    $set:req.body,
                },{
                    new:true
                });

                res.status(200).json("post updated successfully");
            }catch (e) {
                res.status(500).json("there is an error to update post");
                console.log(e)
            }
        }else {
            res.status(401).json("You can update only your post");
        }
    }catch (e) {
        res.status(500).json("there is a server error");
        console.log(e)
    }

}
//delete Post
async function deletePost(req, res, next) {
    try {
        const post = await Post.findById(req.params.id);

        if (post.author === req.body.author){
            try {
                await post.delete();
                res.status(200).json("post Deleted successfully");
            }catch (e) {
                res.status(500).json("there is an error to Delete post");
                console.log(e)
            }
        }else {
            res.status(401).json("You can delete only your post");
        }
    }catch (e) {
        res.status(500).json("there is a server error");
        console.log(e)
    }

}

module.exports = {
    addNewPost,
    getSinglePost,
    getAllPost,
    updatePost,
    deletePost
}