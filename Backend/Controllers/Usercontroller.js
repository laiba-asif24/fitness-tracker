const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, data: user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, profilePicture, bio } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  if (name !== undefined) user.name = name;
  if (profilePicture !== undefined) user.profilePicture = profilePicture;
  if (bio !== undefined) user.bio = bio;

  const updatedUser = await user.save();
  res.status(200).json({ success: true, data: updatedUser });
});

const updateSettings = asyncHandler(async (req, res) => {
  const { units, theme, notificationsEnabled } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  if (units !== undefined) user.preferences.units = units;
  if (theme !== undefined) user.preferences.theme = theme;
  if (notificationsEnabled !== undefined) user.preferences.notificationsEnabled = notificationsEnabled;

  const updatedUser = await user.save();
  res.status(200).json({ success: true, data: updatedUser.preferences });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Please provide current and new password');
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully' });
});

const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) throw new ApiError(400, 'Search query is required');

  const users = await User.find({ $text: { $search: q } }).select('name username profilePicture');
  res.status(200).json({ success: true, count: users.length, data: users });
});

// ---------------- Admin only ----------------

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true, count: users.length, data: users });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  await user.deleteOne();
  res.status(200).json({ success: true, message: 'User deleted successfully' });
});

module.exports = {
  getProfile,
  updateProfile,
  updateSettings,
  changePassword,
  searchUsers,
  getAllUsers,
  deleteUser,
};