const { put } = require('@vercel/blob');
const crypto = require("crypto");

const uploadToVercelBlob = (fieldName) => async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        //Not a good practice to throw error from middleware, but for simplicity
        //return res.status(400).json({ message: "No files uploaded" });
        req[fieldName] = [];
        return next();
    }

    try {
        const uploadedFiles = await Promise.all(
            req.files.map(async (file) => {
                const fileName = `files/${crypto.randomUUID()}-${file.originalname}`;
                const blobResponse = await put(fileName, file.buffer, {
                    access: "public",
                    contentType: file.mimetype
                });
                return blobResponse.url
        }));

        req[fieldName] = uploadedFiles;
        next();
        
    } catch (error) {
        return res.status(500).json({ message: "Error uploading files", error: error.message });
    }
};

module.exports = { uploadToVercelBlob };