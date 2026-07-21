const mongoose = require('mongoose');

// FoodItem sub-schema — embedded inside NutritionLog
const FoodItemSchema = new mongoose.Schema(
  {
    foodName: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: 'g' }, // g, ml, pcs
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
  },
  { _id: true }
);

const NutritionLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
      required: true,
    },
    items: [FoodItemSchema],
    totalCalories: { type: Number, default: 0 },
    totalMacros: {
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fats: { type: Number, default: 0 },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Auto-compute totalCalories & totalMacros from items before saving
NutritionLogSchema.pre('save', function (next) {
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
  this.totalMacros = { protein: totals.protein, carbs: totals.carbs, fats: totals.fats };
  next();
});

NutritionLogSchema.index({ user: 1, date: -1 });
NutritionLogSchema.index({ 'items.foodName': 'text' });

module.exports = mongoose.model('NutritionLog', NutritionLogSchema);
