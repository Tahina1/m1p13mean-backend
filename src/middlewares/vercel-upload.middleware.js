const { put } = require('@vercel/blob');
const { v4: uuid } = require('uuid');

const uploadToVercelBlob = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        //Not a good practice to throw error from middleware, but for simplicity
        //return res.status(400).json({ message: "No files uploaded" });
        req.gallery = [];
        return next();
    }

    try {
        const uploadedFiles = await Promise.all(
            req.files.map(async (file) => {
                const fileName = `shops/${uuid()}-${file.originalname}`;
                const blobResponse = await put(fileName, file.buffer, {
                    access: "public",
                    contentType: file.mimetype
                });
                return blobResponse.url
        }));

        req.gallery = uploadedFiles;
        next();
        
    } catch (error) {
        return res.status(500).json({ message: "Error uploading files", error: error.message });
    }
};

module.exports = { uploadToVercelBlob };