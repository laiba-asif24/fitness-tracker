const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // never return password by default
    },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 300 },
    preferences: {
      units: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
      notificationsEnabled: { type: Boolean, default: true },
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

// Hash password before saving (only if it was modified)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Text index for search
UserSchema.index({ name: 'text', username: 'text' });

module.exports = mongoose.model('User', UserSchema);