/*
*external imports
*/
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            unique:true
        },
        description:{
            type:String,
            required:true,
        },
        thumbnail:{
            type: String,
            default:""
        },
        author:{
            type:String,
            required:true,
        },
        categories:{
            type:Array,
            required:false,
        },
    },
    {
        timestamps: true
    }
);

//create mongoose model with people Schema
const post = mongoose.model('post',PostSchema);

//export the model
module.exports = post;