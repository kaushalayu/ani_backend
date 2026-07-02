/**
 * Auto-seed default categories on server start.
 * Sirf nahi hain toh create karta hai — existing ko touch nahi karta.
 */
const Category = require('../models/Category')

const DEFAULT_CATEGORIES = [
  {
    name: 'Sleeping Pills',
    description: 'Sleep aids and insomnia relief medicines for restful nights.',
  },
  {
    name: 'Painkillers',
    description: 'Fast-acting pain relief medicines for headaches, body pain and more.',
  },
  {
    name: 'Anxiety Pills',
    description: 'Anxiety and stress relief medicines for a calm and balanced mind.',
  },
  {
    name: 'Vitamins & Supplements',
    description: 'Daily vitamins, minerals and health supplements.',
  },
  {
    name: 'Antibiotics',
    description: 'Prescription antibiotics for bacterial infections.',
  },
  {
    name: 'Skin Care',
    description: 'Dermatologist-recommended skin care products and medicines.',
  },
]

const seedCategories = async () => {
  try {
    const count = await Category.countDocuments()
    if (count > 0) {
      console.log(`ℹ️  ${count} categories already exist — skipping seed`)
      return
    }
    for (const cat of DEFAULT_CATEGORIES) {
      await Category.create(cat)
      console.log(`✅ Category seeded: ${cat.name}`)
    }
  } catch (err) {
    console.error('⚠️  Category seeding error:', err.message)
  }
}

module.exports = seedCategories
