/*
*external imports
*/
const bcrypt = require('bcrypt');
/*
*internal imports
*/
const User = require('../models/User');
const Post = require('../models/Post');

//add new user
async function registerNewUser(req, res, next) {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    //save data to user table
    let newUser;
    if (req.files && req.files.length > 0){
        newUser = new User({
            username:req.body.username,
            email:req.body.email,
            avatar:req.files[0].filename,
            password:hashedPassword
        });
    }else {
        newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        });
    }
    try {

        const user = await newUser.save();
        const userObject = {
            id:user._id,
            username:user.username,
            email:user.email,
            avatar:user.avatar||null,
        }

        res.status(200).json(userObject)
    }catch (e) {
        res.status(500).json(e)
    }
}

//do login
async function loginUser(req, res, next) {
    
    try {
        //try to find a user with this username/email
        const user = await User.findOne({
            $or:[{email:req.body.username},{username:req.body.username}],
        });
       
        if (user && user._id){
            console.log(user)
            //check if the password is valid
            const isValidPassword = await bcrypt.compare(req.body.password,user.password);

            if (isValidPassword){

                //create user object to create token or giving response
                const userObject = {
                    id:user._id,
                    username:user.username,
                    email:user.email,
                    avatar:user.avatar||null,
                }

                //creating jwt and save it to localstorage/cookie
                res.status(400).json(userObject);
            }else {
                res.status(400).json('wrong credentials!');
            }
        }else {
            res.status(400).json('wrong credentials!');
        }


    }catch (e) {
        res.status(500).json(e);
    }
}

//update user
async function updateUser(req, res, next) {
    if (req.body.userId === req.params.id){

        if (req.body.password){
            const password = req.body.password;
            const salt = await bcrypt.genSalt(10);
             req.body.password = await bcrypt.hash(password,salt);
        }
        //trying to update user info
        try {
            const updatedUserObject = {
                username:req.body.username,
                email:req.body.email,
                password:req.body.password
            }

            const updatedUser = await User.findByIdAndUpdate(req.params.id,updatedUserObject,{new:true})

            if (updatedUser){
                const userObject = {
                    userId:updatedUser._id,
                    username:updatedUser.username,
                    email:updatedUser.email,
                    avatar:updatedUser.avatar||null,
                }
                res.status(200).json('info update successfully.');
            }else {
                res.status(500).json('info update failed !');
            }

        }catch (e) {
            res.status(500).json('info update failed !');
        }
    }else {
        res.status(400).json('sorry you can only update your info !');
    }
}

//delete user
async function deleteUser(req, res, next) {
    if (req.body.userId === req.params.id){

        try {
            //find all post form the post table for this user
            const user = await User.findById(req.params.id);
            if (user){
                //trying to delete user
                try {
                    await Post.deleteMany({author:user.username});
                    await User.findByIdAndDelete(req.params.id);
                    res.status(500).json('Deleted successfully !');
                }catch (e) {
                    res.status(500).json('info update failed !');
                }
            }else {
                res.status(400).json('there is no user !');
            }
        }catch (e) {
            res.status(400).json('sorry you can only delete your account !');
        }

    }else {
        res.status(400).json('sorry you can only delete your account !');
    }
}

module.exports = {
    registerNewUser,
    loginUser,
    updateUser,
    deleteUser
}