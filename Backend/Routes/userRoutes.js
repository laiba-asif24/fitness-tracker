const express = require('express');
const {
  getProfile,
  updateProfile,
  updateSettings,
  changePassword,
  searchUsers,
  getAllUsers,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); 
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/settings', updateSettings);
router.put('/password', changePassword);
router.get('/search', searchUsers);

// Admin only
router.get('/', authorize('admin'), getAllUsers);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;