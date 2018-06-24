const multer = require('multer');
const mkdirp = require('mkdirp');
const uniqid = require('uniqid');

const ImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = './public/uploads/images';

        mkdirp(dir, err => cb(err, dir))
    },
    filename: (req, file, cb) => {
        let fileParts = file.originalname.split(".");
        let extension = fileParts[fileParts.length - 1];

        cb(null, uniqid() + '.' + extension)
    }
});

const imageFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
        cb(null, true)
    } else {
        cb(null, false)
    }
};

const uploadImage = multer({
    storage: ImageStorage,
    limits: {
        fileSize: 1024 * 1024
    },
    fileFilter: imageFilter
});


module.exports = {
    uploadImage
};