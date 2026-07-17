const mongoose = require('mongoose');
const { Schema } = mongoose;

// 4.1 FoodItem — embedded sub-document
const FoodItemSchema = new Schema(
  {
    foodName: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      min: 0,
    },
    unit: {
      type: String, // e.g. g, ml, pcs
      trim: true,
    },
    calories: {
      type: Number,
      min: 0,
      default: 0,
    },
    protein: {
      type: Number, // grams
      min: 0,
      default: 0,
    },
    carbs: {
      type: Number, // grams
      min: 0,
      default: 0,
    },
    fats: {
      type: Number, // grams
      min: 0,
      default: 0,
    },
  },
  { _id: true }
);

const NutritionLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
      required: true,
    },
    items: {
      type: [FoodItemSchema],
      default: [],
    },
    totalCalories: {
      type: Number,
      default: 0,
    },
    totalMacros: {
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fats: { type: Number, default: 0 },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // spec only calls for createdAt
);

// Auto-compute totalCalories / totalMacros from items whenever they change,
// so the frontend never has to send (or trust) pre-aggregated numbers.
NutritionLogSchema.pre('save', function (next) {
  if (this.isModified('items')) {
    const totals = this.items.reduce(
      (acc, item) => {
        acc.calories += item.calories || 0;
        acc.protein += item.protein || 0;
        acc.carbs += item.carbs || 0;
        acc.fats += item.fats || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    this.totalCalories = totals.calories;
    this.totalMacros = {
      protein: totals.protein,
      carbs: totals.carbs,
      fats: totals.fats,
    };
  }
  next();
});

// Search foods by name (Search & Filter requirement) + common query pattern
NutritionLogSchema.index({ 'items.foodName': 'text' });
NutritionLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('NutritionLog', NutritionLogSchema);
