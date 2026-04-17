const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Dynamic upload directory based on file type
const getUploadDir = (fileType) => {
        const baseDir = path.join(__dirname, "../../PUBLIC/UPLOADS");

        // Create subdirectories for different file types
        const subDir = path.join(baseDir, fileType === 'resume' ? 'RESUMES' : 'OTHER');

        if (!fs.existsSync(subDir)) {
                fs.mkdirSync(subDir, { recursive: true });
        }

        return subDir;
};

const storage = multer.diskStorage({
        destination: (req, file, cb) => {
                // Determine file type from request or file
                const uploadType = req.body.type || 'resume';
                const uploadPath = getUploadDir(uploadType);
                cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
                // ✅ Generate a clean filename
                const timestamp = Date.now();
                const random = Math.round(Math.random() * 1e9);
                const ext = path.extname(file.originalname).toLowerCase();
                const sanitizedName = file.originalname
                        .replace(ext, '')
                        .replace(/[^a-zA-Z0-9]/g, '_')
                        .substring(0, 50);

                cb(null, `${timestamp}-${random}-${sanitizedName}${ext}`);
        },
});

const fileFilter = (req, file, cb) => {
        const allowedMimes = {
                'application/pdf': '.pdf',
                'application/msword': '.doc',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
        };

        if (allowedMimes[file.mimetype]) {
                cb(null, true);
        } else {
                cb(new Error(`Unsupported file type: ${file.mimetype}. Please upload PDF, DOC, or DOCX.`), false);
        }
};

const upload = multer({
        storage,
        limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
                files: 1 // Max 1 file per request
        },
        fileFilter
});

module.exports = upload;
