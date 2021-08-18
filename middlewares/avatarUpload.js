/*
*internal imports
*/
const uploader = require('../utilities/singleUploader');

function thumbnailUpload(path) {
   return function avatarUpload(req, res, next) {
       const subFolderPath = path;
       const upload = uploader(subFolderPath, ['image/jpeg', 'image/jpg', 'image/png'], 1000000, 'only .jpg, .jpeg and .png format allowed');

       //call the multer middleware function
       upload.any()(req, res, (err) => {
           if (err) {
               res.status(500).json({
                   errors: {
                       avatar: {
                           msg: err.message,
                       }
                   }
               });
           } else {
               next();
           }
       });
   }
}


module.exports = thumbnailUpload;