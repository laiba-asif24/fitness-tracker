const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ApiError = require('../utils/ApiError');

// Creates the given folder (relative to project root) if it doesn't exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Builds a multer instance that stores files under /uploads/<subfolder>
// Usage: uploadTo('profile').single('profilePicture')
const uploadTo = (subfolder) => {
  const destDir = path.join(__dirname, '..', 'uploads', subfolder);
  ensureDir(destDir);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, destDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${req.user ? req.user._id : 'anon'}-${Date.now()}${ext}`;
      cb(null, uniqueName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extOk = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowedTypes.test(file.mimetype);
    if (extOk && mimeOk) return cb(null, true);
    cb(new ApiError(400, 'Only image files (jpg, jpeg, png, webp) are allowed'));
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  });
};

module.exports = uploadTo;