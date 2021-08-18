/*
*external imports
*/
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique:true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique:true
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default:""
        },
    },
    {
        timestamps: true
    }
);

//create mongoose model with people Schema
const user = mongoose.model('user',UserSchema);

//export the model
module.exports = user;