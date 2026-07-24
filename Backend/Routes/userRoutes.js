const express = require('express');
const {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  updateSettings,
  changePassword,
  searchUsers,
  getAllUsers,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const uploadTo = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect); // all routes below require authentication

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile/picture', uploadTo('profile').single('profilePicture'), uploadProfilePicture);
router.put('/settings', updateSettings);
router.put('/password', changePassword);
router.get('/search', searchUsers);

// Admin only
router.get('/', authorize('admin'), getAllUsers);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;