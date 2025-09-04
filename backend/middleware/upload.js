const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const streamifier = require('streamifier');

const upload = multer();

const uploadToCloudinary = (req, res, next) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const stream = cloudinary.uploader.upload_stream(
        { folder: 'uploads' },
        (error, result) => {
            if (error) return res.status(500).json({ error: error.message });
            req.file.cloudinary = result;
            next();
        }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
};

module.exports = { upload, uploadToCloudinary };