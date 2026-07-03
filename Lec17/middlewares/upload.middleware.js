const multer = require('multer');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(null, true);
    }
    cb(new Error('მხოლოდ სურათების ატვირთვაა დაშვებული (jpg, png, webp)'));
}

const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter,
});

function handleProfilePictureUpload(req, res, next) {
    upload.single('profilePicture')(req, res, (err) => {
        if (!err) return next();

        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'ფაილის ზომა არ უნდა აღემატებოდეს 5MB-ს' });
        }

        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'ფაილის ატვირთვის შეცდომა' });
        }

        return res.status(400).json({ error: err.message });
    });
}

module.exports = handleProfilePictureUpload;
