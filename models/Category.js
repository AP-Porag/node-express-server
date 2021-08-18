/*
*external imports
*/
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            unique:true
        },
        thumbnail:{
            type: String,
            default:""
        }
    },
    {
        timestamps: true
    }
);

//create mongoose model with people Schema
const category = mongoose.model('category',CategorySchema);

//export the model
module.exports = category;