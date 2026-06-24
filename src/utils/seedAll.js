require('dotenv').config({ path: require('path').join(__dirname, '../../.env') })
const mongoose = require('mongoose')
const User = require('../models/User')
const Category = require('../models/Category')
const Product = require('../models/Product')
const Blog = require('../models/Blog')
const Testimonial = require('../models/Testimonial')
const Service = require('../models/Service')
const Team = require('../models/Team')
const seedCategories = require('./seedCategories')

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@painomed.com'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'Admin@123Secure'
const ADMIN_NAME = 'Admin'

const PRODUCTS = [
  // ── Sleeping Pills ─────────────────────────────────
  {
    name: 'Zolpidem 10mg Tablets',
    description: 'Fast-acting prescription sleeping aid for short-term insomnia treatment. Helps you fall asleep within 15-20 minutes.',
    shortDescription: 'Fast-acting insomnia relief',
    badge: 'sleep aid',
    tags: ['insomnia', 'sleep', 'zolpidem'],
    price: 1299,
    oldPrice: 1599,
    stock: 150,
    isFeatured: true,
    isBestSeller: true,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 15, price: 699, oldPrice: 899, stock: 100 },
      { count: 30, price: 1299, oldPrice: 1599, stock: 150 },
      { count: 60, price: 2299, oldPrice: 2799, stock: 80 },
      { count: 90, price: 3199, oldPrice: 3999, stock: 50 },
    ],
    howToUse: 'Take one tablet 15-30 minutes before bedtime. Swallow whole with water.',
    sideEffects: 'Drowsiness, dizziness, headache, dry mouth, or next-day grogginess.',
    ingredients: 'Zolpidem Tartrate 10mg, Microcrystalline Cellulose, Magnesium Stearate.',
    additionalInfo: 'For short-term use only (2-4 weeks). Do not combine with alcohol.',
  },
  {
    name: 'Melatonin 5mg Sleep Gummies',
    description: 'Natural sleep aid with melatonin and chamomile extract. Sugar-free gummies for restful sleep without grogginess.',
    shortDescription: 'Natural melatonin gummies',
    badge: 'herbal',
    tags: ['melatonin', 'gummies', 'natural', 'sleep'],
    price: 849,
    oldPrice: 999,
    stock: 200,
    isFeatured: true,
    isNewArrival: true,
    howToUse: 'Chew 1-2 gummies 30 minutes before bedtime. Do not exceed 2 gummies in 24 hours.',
    sideEffects: 'Mild drowsiness, vivid dreams. Generally well-tolerated.',
    ingredients: 'Melatonin 5mg, Chamomile Extract, Pectin, Natural Sweeteners.',
    additionalInfo: 'Non-habit forming. Suitable for adults and children above 12 years.',
  },
  {
    name: 'Eszopiclone 2mg Tablets',
    description: 'Prescription sleep medication for chronic insomnia. Helps maintain sleep throughout the night.',
    shortDescription: 'For chronic insomnia relief',
    badge: 'sleep aid',
    tags: ['insomnia', 'eszopiclone', 'sleep'],
    price: 1499,
    oldPrice: 1899,
    stock: 100,
    isBestSeller: true,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 15, price: 799, oldPrice: 999, stock: 80 },
      { count: 30, price: 1499, oldPrice: 1899, stock: 100 },
      { count: 60, price: 2699, oldPrice: 3299, stock: 60 },
    ],
    howToUse: 'Take one tablet immediately before bedtime. Only take if you have 7-8 hours to sleep.',
    sideEffects: 'Unpleasant taste, dry mouth, dizziness, daytime drowsiness.',
    ingredients: 'Eszopiclone 2mg, Lactose Monohydrate, Pregelatinized Starch.',
    additionalInfo: 'Do not take with high-fat meals as it may reduce effectiveness.',
  },
  {
    name: 'Diphenhydramine 25mg Sleep Capsules',
    description: 'Antihistamine-based sleep aid for occasional sleeplessness. Non-prescription relief.',
    shortDescription: 'OTC sleep capsules',
    badge: 'sleep aid',
    tags: ['diphenhydramine', 'antihistamine', 'sleep'],
    price: 449,
    oldPrice: 549,
    stock: 300,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 30, price: 449, oldPrice: 549, stock: 300 },
      { count: 60, price: 799, oldPrice: 999, stock: 200 },
    ],
    howToUse: 'Take 1-2 capsules 30 minutes before bedtime.',
    sideEffects: 'Drowsiness, dry mouth, blurred vision, dizziness.',
    ingredients: 'Diphenhydramine HCl 25mg, Gelatin, Glycerin.',
    additionalInfo: 'For adults only. Do not use for more than 2 weeks continuously.',
  },
  {
    name: 'Ramelteon 8mg Tablets',
    description: 'Prescription insomnia medication that targets the body\'s sleep-wake cycle with minimal side effects.',
    shortDescription: 'Sleep-wake cycle regulator',
    badge: 'sleep aid',
    tags: ['ramelteon', 'insomnia', 'circadian'],
    price: 1899,
    oldPrice: 2299,
    stock: 75,
    isNewArrival: true,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 15, price: 999, oldPrice: 1199, stock: 50 },
      { count: 30, price: 1899, oldPrice: 2299, stock: 75 },
    ],
    howToUse: 'Take one tablet within 30 minutes of going to bed. Do not take after a high-fat meal.',
    sideEffects: 'Dizziness, nausea, fatigue, headache.',
    ingredients: 'Ramelteon 8mg, Lactose, Croscarmellose Sodium.',
    additionalInfo: 'Not a controlled substance - lower abuse potential than other sleep aids.',
  },

  // ── Painkillers ────────────────────────────────────
  {
    name: 'Ibuprofen 400mg Tablets',
    description: 'NSAID pain relief for headaches, muscle aches, arthritis, and fever. Fast-acting anti-inflammatory.',
    shortDescription: 'Fast pain & inflammation relief',
    badge: 'painkiller',
    tags: ['ibuprofen', 'pain', 'inflammation', 'headache'],
    price: 199,
    oldPrice: 249,
    stock: 500,
    isFeatured: true,
    isBestSeller: true,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 30, price: 199, oldPrice: 249, stock: 500 },
      { count: 60, price: 349, oldPrice: 449, stock: 400 },
      { count: 120, price: 599, oldPrice: 799, stock: 300 },
    ],
    howToUse: 'Take 1-2 tablets every 6-8 hours as needed. Do not exceed 6 tablets in 24 hours.',
    sideEffects: 'Stomach upset, heartburn, nausea. Take with food to minimize.',
    ingredients: 'Ibuprofen 400mg, Microcrystalline Cellulose, Croscarmellose Sodium.',
    additionalInfo: 'Avoid if you have stomach ulcers or are on blood thinners.',
  },
  {
    name: 'Acetaminophen 500mg Extra Strength',
    description: 'Effective pain reliever and fever reducer for headaches, toothaches, and body pain.',
    shortDescription: 'Extra strength pain relief',
    badge: 'painkiller',
    tags: ['acetaminophen', 'paracetamol', 'pain', 'fever'],
    price: 149,
    oldPrice: 179,
    stock: 600,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 30, price: 149, oldPrice: 179, stock: 600 },
      { count: 60, price: 249, oldPrice: 299, stock: 500 },
      { count: 120, price: 449, oldPrice: 549, stock: 400 },
    ],
    howToUse: 'Take 1-2 tablets every 4-6 hours. Do not exceed 8 tablets (4000mg) in 24 hours.',
    sideEffects: 'Generally well-tolerated. Rare skin reactions possible.',
    ingredients: 'Acetaminophen 500mg, Povidone, Starch, Magnesium Stearate.',
    additionalInfo: 'Do not combine with other acetaminophen-containing products.',
  },
  {
    name: 'Naproxen 250mg Tablets',
    description: 'Long-lasting NSAID pain relief for arthritis, muscle pain, and menstrual cramps with 12-hour dosing.',
    shortDescription: '12-hour pain relief',
    badge: 'painkiller',
    tags: ['naproxen', 'arthritis', 'pain', 'nsaid'],
    price: 299,
    oldPrice: 399,
    stock: 250,
    isBestSeller: true,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 30, price: 299, oldPrice: 399, stock: 250 },
      { count: 60, price: 549, oldPrice: 699, stock: 200 },
    ],
    howToUse: 'Take one tablet every 12 hours. For best results, take with food.',
    sideEffects: 'Stomach upset, constipation, dizziness, headache.',
    ingredients: 'Naproxen 250mg, Carnauba Wax, Hypromellose, Titanium Dioxide.',
    additionalInfo: 'Provides up to 12 hours of relief. Take with food or milk.',
  },
  {
    name: 'Tramadol 50mg Capsules',
    description: 'Prescription pain medication for moderate to severe pain. Works by altering how the brain senses pain.',
    shortDescription: 'For moderate to severe pain',
    badge: 'painkiller',
    tags: ['tramadol', 'pain', 'prescription'],
    price: 899,
    oldPrice: 1099,
    stock: 120,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 15, price: 499, oldPrice: 599, stock: 100 },
      { count: 30, price: 899, oldPrice: 1099, stock: 120 },
      { count: 60, price: 1599, oldPrice: 1999, stock: 80 },
    ],
    howToUse: 'Take 1 capsule every 4-6 hours as needed for pain. Do not exceed 4 capsules in 24 hours.',
    sideEffects: 'Dizziness, nausea, constipation, drowsiness.',
    ingredients: 'Tramadol HCl 50mg, Lactose, Gelatin.',
    additionalInfo: 'May cause dependence. Use exactly as prescribed by your doctor.',
  },
  {
    name: 'Diclofenac Gel 30g',
    description: 'Topical NSAID gel for localized joint and muscle pain. Targeted relief with minimal systemic effects.',
    shortDescription: 'Topical pain relief gel',
    badge: 'painkiller',
    tags: ['diclofenac', 'gel', 'topical', 'joint pain'],
    price: 399,
    oldPrice: 499,
    stock: 180,
    isFeatured: true,
    isNewArrival: true,
    howToUse: 'Apply a small amount to the affected area 3-4 times daily. Gently massage until absorbed.',
    sideEffects: 'Application site irritation, rash, itching.',
    ingredients: 'Diclofenac Diethylamine 1.16%, Isopropyl Alcohol, Carbomer, Purified Water.',
    additionalInfo: 'For external use only. Wash hands after application.',
  },

  // ── Anxiety Pills ──────────────────────────────────
  {
    name: 'Alprazolam 0.5mg Tablets',
    description: 'Anti-anxiety medication for panic disorders and generalized anxiety. Fast-acting relief.',
    shortDescription: 'Fast anxiety relief',
    badge: 'calm',
    tags: ['alprazolam', 'xanax', 'anxiety', 'panic'],
    price: 1099,
    oldPrice: 1399,
    stock: 200,
    isBestSeller: true,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 15, price: 599, oldPrice: 799, stock: 150 },
      { count: 30, price: 1099, oldPrice: 1399, stock: 200 },
      { count: 60, price: 1999, oldPrice: 2499, stock: 100 },
    ],
    howToUse: 'Take as prescribed, typically 0.25-0.5mg three times daily. Do not crush or chew.',
    sideEffects: 'Drowsiness, dizziness, fatigue, memory problems, dry mouth.',
    ingredients: 'Alprazolam 0.5mg, Lactose, Corn Starch, Magnesium Stearate.',
    additionalInfo: 'May cause dependence. Do not stop abruptly - taper under medical supervision.',
  },
  {
    name: 'Sertraline 50mg Tablets',
    description: 'SSRI antidepressant for anxiety, depression, OCD, and panic disorders. Long-term management.',
    shortDescription: 'Long-term anxiety management',
    badge: 'calm',
    tags: ['sertraline', 'zoloft', 'ssri', 'anxiety', 'depression'],
    price: 799,
    oldPrice: 999,
    stock: 300,
    isFeatured: true,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 15, price: 449, oldPrice: 549, stock: 200 },
      { count: 30, price: 799, oldPrice: 999, stock: 300 },
      { count: 60, price: 1399, oldPrice: 1799, stock: 200 },
    ],
    howToUse: 'Take once daily, preferably in the morning. Consistent timing is important.',
    sideEffects: 'Nausea, insomnia, fatigue, sexual dysfunction. Most improve after 2-4 weeks.',
    ingredients: 'Sertraline HCl 50mg, Dibasic Calcium Phosphate, Microcrystalline Cellulose.',
    additionalInfo: 'Therapeutic benefits may take 2-4 weeks. Continue as prescribed.',
  },
  {
    name: 'L-Theanine 200mg Capsules',
    description: 'Natural amino acid for stress relief and calm focus without drowsiness. Non-prescription.',
    shortDescription: 'Natural stress relief',
    badge: 'herbal',
    tags: ['l-theanine', 'calm', 'stress', 'natural'],
    price: 599,
    oldPrice: 749,
    stock: 400,
    isNewArrival: true,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 30, price: 599, oldPrice: 749, stock: 400 },
      { count: 60, price: 999, oldPrice: 1299, stock: 300 },
    ],
    howToUse: 'Take 1-2 capsules daily with or without food. Can be taken with coffee for focused calm.',
    sideEffects: 'No significant side effects. Very well-tolerated.',
    ingredients: 'L-Theanine 200mg, Rice Flour, Vegetable Capsule.',
    additionalInfo: 'Can be taken with caffeine to reduce jitters while maintaining alertness.',
  },
  {
    name: 'Clonazepam 0.5mg Tablets',
    description: 'Benzodiazepine for panic disorder, certain types of seizures, and anxiety disorders.',
    shortDescription: 'Panic disorder treatment',
    badge: 'calm',
    tags: ['clonazepam', 'klonopin', 'anxiety', 'panic', 'seizures'],
    price: 1299,
    oldPrice: 1599,
    stock: 150,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 15, price: 699, oldPrice: 899, stock: 100 },
      { count: 30, price: 1299, oldPrice: 1599, stock: 150 },
      { count: 60, price: 2299, oldPrice: 2899, stock: 80 },
    ],
    howToUse: 'Take as prescribed, usually 0.5mg three times daily or as needed for panic.',
    sideEffects: 'Drowsiness, unsteadiness, memory problems, difficulty concentrating.',
    ingredients: 'Clonazepam 0.5mg, Lactose, Corn Starch, FD&C Blue #1.',
    additionalInfo: 'Long-acting benzodiazepine. Taper off gradually to avoid withdrawal.',
  },
  {
    name: 'Ashwagandha 500mg Capsules',
    description: 'Ayurvedic adaptogen for stress reduction, energy boost, and overall wellness. Clinically studied.',
    shortDescription: 'Ayurvedic stress relief',
    badge: 'herbal',
    tags: ['ashwagandha', 'adaptogen', 'stress', 'ayurvedic'],
    price: 449,
    oldPrice: 549,
    stock: 350,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 30, price: 449, oldPrice: 549, stock: 350 },
      { count: 60, price: 799, oldPrice: 999, stock: 250 },
      { count: 120, price: 1399, oldPrice: 1799, stock: 150 },
    ],
    howToUse: 'Take 1-2 capsules daily after meals. Best results with consistent use over 4-8 weeks.',
    sideEffects: 'Mild digestive upset. Not recommended during pregnancy or thyroid conditions.',
    ingredients: 'Ashwagandha Root Extract 500mg, Black Pepper Extract, Vegetable Cellulose.',
    additionalInfo: 'Clinically shown to reduce cortisol levels by up to 30%.',
  },

  // ── Vitamins & Supplements ─────────────────────────
  {
    name: 'Vitamin D3 2000IU Softgels',
    description: 'High-potency Vitamin D3 for bone health, immune function, and mood regulation. Essential for overall wellness.',
    shortDescription: 'Bone & immune health',
    badge: 'vitamin',
    tags: ['vitamin d', 'd3', 'immune', 'bone health'],
    price: 349,
    oldPrice: 449,
    stock: 500,
    isFeatured: true,
    isBestSeller: true,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 30, price: 349, oldPrice: 449, stock: 500 },
      { count: 60, price: 599, oldPrice: 799, stock: 400 },
      { count: 120, price: 999, oldPrice: 1299, stock: 300 },
    ],
    howToUse: 'Take one softgel daily with a meal containing fat for best absorption.',
    sideEffects: 'Rare at recommended doses. High doses may cause calcium buildup.',
    ingredients: 'Vitamin D3 (Cholecalciferol) 2000IU, Olive Oil, Gelatin, Glycerin.',
    additionalInfo: '2000IU is the standard daily maintenance dose. Higher doses available on prescription.',
  },
  {
    name: 'Omega-3 Fish Oil 1000mg',
    description: 'Premium fish oil with EPA and DHA for heart health, brain function, and joint support.',
    shortDescription: 'Heart & brain support',
    badge: 'vitamin',
    tags: ['omega-3', 'fish oil', 'heart', 'epa', 'dha'],
    price: 549,
    oldPrice: 699,
    stock: 400,
    isFeatured: true,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 30, price: 549, oldPrice: 699, stock: 400 },
      { count: 60, price: 949, oldPrice: 1199, stock: 300 },
      { count: 120, price: 1699, oldPrice: 2199, stock: 200 },
    ],
    howToUse: 'Take 1-2 softgels daily with meals. Take with food for best absorption and to reduce fishy aftertaste.',
    sideEffects: 'Fishy aftertaste, mild burping. Freeze to minimize.',
    ingredients: 'Fish Oil Concentrate 1000mg (EPA 300mg, DHA 200mg), Gelatin, Vitamin E.',
    additionalInfo: 'Molecularly distilled to remove mercury and contaminants.',
  },
  {
    name: 'Multivitamin Daily Formula',
    description: 'Complete daily multivitamin with 23 essential vitamins and minerals for overall health and vitality.',
    shortDescription: 'Complete daily nutrition',
    badge: 'vitamin',
    tags: ['multivitamin', 'daily', 'essential'],
    price: 699,
    oldPrice: 899,
    stock: 350,
    isBestSeller: true,
    isNewArrival: true,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 30, price: 699, oldPrice: 899, stock: 350 },
      { count: 60, price: 1199, oldPrice: 1499, stock: 250 },
      { count: 120, price: 1999, oldPrice: 2599, stock: 150 },
    ],
    howToUse: 'Take one tablet daily with a meal. Do not exceed recommended dose.',
    sideEffects: 'Mild stomach upset if taken on empty stomach.',
    ingredients: 'Vitamin A, C, D, E, B-Complex, Zinc, Magnesium, Selenium, Iron, Calcium.',
    additionalInfo: 'Complete daily nutrition in one tablet.',
  },
  {
    name: 'Vitamin B12 1000mcg Sublingual',
    description: 'Quick-absorbing vitamin B12 for energy, nerve health, and red blood cell formation. Essential for vegetarians.',
    shortDescription: 'Energy & nerve health',
    badge: 'vitamin',
    tags: ['b12', 'energy', 'sublingual', 'vegetarian'],
    price: 399,
    oldPrice: 499,
    stock: 450,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 30, price: 399, oldPrice: 499, stock: 450 },
      { count: 60, price: 699, oldPrice: 899, stock: 350 },
    ],
    howToUse: 'Place one tablet under tongue until dissolved (about 30 seconds). Use daily.',
    sideEffects: 'None reported. Water-soluble vitamin - excess is naturally excreted.',
    ingredients: 'Methylcobalamin (Vitamin B12) 1000mcg, Mannitol, Microcrystalline Cellulose.',
    additionalInfo: 'Sublingual absorption bypasses digestive system for maximum uptake.',
  },
  {
    name: 'Magnesium Glycinate 400mg',
    description: 'Highly absorbable magnesium for sleep, muscle relaxation, stress reduction, and heart health.',
    shortDescription: 'Sleep & muscle relaxation',
    badge: 'vitamin',
    tags: ['magnesium', 'sleep', 'muscle', 'stress'],
    price: 649,
    oldPrice: 799,
    stock: 280,
    isFeatured: true,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 30, price: 649, oldPrice: 799, stock: 280 },
      { count: 60, price: 1099, oldPrice: 1399, stock: 200 },
      { count: 120, price: 1899, oldPrice: 2499, stock: 120 },
    ],
    howToUse: 'Take 1-2 capsules daily, preferably in the evening for sleep support.',
    sideEffects: 'Most gentle on stomach. Rare: mild digestive upset at high doses.',
    ingredients: 'Magnesium Glycinate Chelate 400mg, Vegetable Capsule, Rice Flour.',
    additionalInfo: 'Glycinate form is the most bioavailable and least likely to cause digestive issues.',
  },

  // ── Antibiotics ────────────────────────────────────
  {
    name: 'Amoxicillin 500mg Capsules',
    description: 'Broad-spectrum penicillin antibiotic for bacterial infections including respiratory, ear, and urinary tract.',
    shortDescription: 'Broad-spectrum antibiotic',
    badge: 'antibiotic',
    tags: ['amoxicillin', 'penicillin', 'infection', 'antibiotic'],
    price: 499,
    oldPrice: 599,
    stock: 250,
    isBestSeller: true,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 15, price: 299, oldPrice: 399, stock: 200 },
      { count: 30, price: 499, oldPrice: 599, stock: 250 },
      { count: 60, price: 899, oldPrice: 1099, stock: 150 },
    ],
    howToUse: 'Take 1 capsule three times daily at evenly spaced intervals. Complete the full course.',
    sideEffects: 'Diarrhea, nausea, rash. Allergic reactions possible in penicillin-sensitive patients.',
    ingredients: 'Amoxicillin Trihydrate 500mg, Gelatin, Titanium Dioxide.',
    additionalInfo: 'Complete the entire prescribed course even if symptoms improve.',
  },
  {
    name: 'Azithromycin 500mg Tablets',
    description: 'Macrolide antibiotic for respiratory infections, skin infections, and certain STDs. Short 3-5 day course.',
    shortDescription: 'Short course antibiotic',
    badge: 'antibiotic',
    tags: ['azithromycin', 'z-pak', 'infection', 'antibiotic'],
    price: 799,
    oldPrice: 999,
    stock: 180,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 3, price: 299, oldPrice: 399, stock: 200 },
      { count: 6, price: 499, oldPrice: 599, stock: 150 },
      { count: 10, price: 799, oldPrice: 999, stock: 180 },
    ],
    howToUse: 'Take 1 tablet daily for 3-5 days as prescribed. Take on an empty stomach for best results.',
    sideEffects: 'Nausea, diarrhea, stomach pain. Less frequent than other antibiotics.',
    ingredients: 'Azithromycin 500mg, Dibasic Calcium Phosphate, Croscarmellose Sodium.',
    additionalInfo: 'Convenient short-course therapy. Do not skip doses.',
  },
  {
    name: 'Ciprofloxacin 500mg Tablets',
    description: 'Fluoroquinolone antibiotic for severe bacterial infections including urinary tract, gastrointestinal, and bone infections.',
    shortDescription: 'For severe infections',
    badge: 'antibiotic',
    tags: ['ciprofloxacin', 'fluoroquinolone', 'uti', 'infection'],
    price: 899,
    oldPrice: 1099,
    stock: 140,
    isFeatured: true,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 10, price: 499, oldPrice: 599, stock: 120 },
      { count: 20, price: 899, oldPrice: 1099, stock: 140 },
    ],
    howToUse: 'Take 1 tablet twice daily. Drink plenty of fluids. Avoid dairy products within 2 hours.',
    sideEffects: 'Nausea, diarrhea, tendonitis risk. Avoid if under 18 or pregnant.',
    ingredients: 'Ciprofloxacin HCl 500mg, Corn Starch, Magnesium Stearate, Hypromellose.',
    additionalInfo: 'Tendon rupture risk — stop immediately if tendon pain or swelling occurs.',
  },
  {
    name: 'Doxycycline 100mg Capsules',
    description: 'Tetracycline antibiotic for acne, respiratory infections, Lyme disease, and malaria prevention.',
    shortDescription: 'Acne & infection treatment',
    badge: 'antibiotic',
    tags: ['doxycycline', 'tetracycline', 'acne', 'antibiotic'],
    price: 599,
    oldPrice: 749,
    stock: 220,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 15, price: 349, oldPrice: 449, stock: 180 },
      { count: 30, price: 599, oldPrice: 749, stock: 220 },
      { count: 60, price: 1099, oldPrice: 1399, stock: 140 },
    ],
    howToUse: 'Take 1 capsule daily or twice daily as prescribed. Take with full glass of water, avoid lying down.',
    sideEffects: 'Photosensitivity, nausea, yeast infections. Use sunscreen.',
    ingredients: 'Doxycycline Hyclate 100mg, Lactose, Microcrystalline Cellulose.',
    additionalInfo: 'Avoid sun exposure. Take at same time each day.',
  },
  {
    name: 'Metronidazole 400mg Tablets',
    description: 'Antibiotic for anaerobic bacterial infections, parasitic infections, and dental infections.',
    shortDescription: 'Anaerobic & parasitic infections',
    badge: 'antibiotic',
    tags: ['metronidazole', 'flagyl', 'infection', 'parasitic'],
    price: 399,
    oldPrice: 499,
    stock: 190,
    hasPillsOptions: true,
    pillsOptions: [
      { count: 15, price: 249, oldPrice: 349, stock: 150 },
      { count: 30, price: 399, oldPrice: 499, stock: 190 },
    ],
    howToUse: 'Take 1 tablet three times daily. Avoid alcohol during treatment and for 48 hours after.',
    sideEffects: 'Metallic taste, nausea, headache. Avoid alcohol completely.',
    ingredients: 'Metronidazole 400mg, Povidone, Croscarmellose Sodium, Hypromellose.',
    additionalInfo: 'No alcohol during treatment — can cause severe reaction.',
  },

  // ── Skin Care ──────────────────────────────────────
  {
    name: 'Tretinoin Cream 0.05% 20g',
    description: 'Prescription retinoid for acne treatment, anti-aging, and skin texture improvement. Vitamin A derivative.',
    shortDescription: 'Acne & anti-aging cream',
    badge: 'cream',
    tags: ['tretinoin', 'retinoid', 'acne', 'anti-aging'],
    price: 699,
    oldPrice: 899,
    stock: 160,
    isFeatured: true,
    isBestSeller: true,
    howToUse: 'Apply pea-sized amount to clean, dry face at night. Start with 2-3 times weekly, gradually increase.',
    sideEffects: 'Initial purging, redness, peeling, sun sensitivity. Use moisturizer and SPF daily.',
    ingredients: 'Tretinoin 0.05%, Purified Water, Stearic Acid, Glycerin, Mineral Oil.',
    additionalInfo: 'Results visible in 8-12 weeks. Consistent SPF use is mandatory.',
  },
  {
    name: 'Clindamycin 1% Gel 30g',
    description: 'Topical antibiotic gel for bacterial acne. Reduces acne-causing bacteria on the skin surface.',
    shortDescription: 'Topical acne antibiotic',
    badge: 'cream',
    tags: ['clindamycin', 'acne', 'antibiotic gel'],
    price: 499,
    oldPrice: 649,
    stock: 200,
    isBestSeller: true,
    howToUse: 'Apply thin layer to affected areas twice daily after cleansing.',
    sideEffects: 'Dryness, peeling, itching. Use moisturizer as needed.',
    ingredients: 'Clindamycin Phosphate 1%, Carbomer, Propylene Glycol, Purified Water.',
    additionalInfo: 'Combine with benzoyl peroxide to reduce antibiotic resistance risk.',
  },
  {
    name: 'Hydrocortisone 1% Cream 30g',
    description: 'Anti-itch and anti-inflammatory cream for eczema, allergic reactions, rashes, and insect bites.',
    shortDescription: 'Anti-itch & rash relief',
    badge: 'cream',
    tags: ['hydrocortisone', 'eczema', 'rash', 'anti-itch'],
    price: 249,
    oldPrice: 299,
    stock: 350,
    howToUse: 'Apply thin layer to affected area 2-3 times daily. Do not cover with bandages.',
    sideEffects: 'Thinning of skin with prolonged use. Limit to 7 days continuous use.',
    ingredients: 'Hydrocortisone 1%, Cetyl Alcohol, Stearyl Alcohol, White Petrolatum.',
    additionalInfo: 'For mild to moderate inflammation. See doctor if no improvement in 7 days.',
  },
  {
    name: 'Salicylic Acid 2% Face Wash 100ml',
    description: 'Oil-free face wash with salicylic acid for acne-prone skin. Unclogs pores and prevents breakouts.',
    shortDescription: 'Acne face wash',
    badge: 'cream',
    tags: ['salicylic acid', 'face wash', 'acne', 'cleanser'],
    price: 449,
    oldPrice: 549,
    stock: 220,
    isNewArrival: true,
    howToUse: 'Use twice daily. Massage onto wet face for 30 seconds, rinse thoroughly.',
    sideEffects: 'Mild dryness initially. Use moisturizer after cleansing.',
    ingredients: 'Salicylic Acid 2%, Aloe Vera, Glycerin, Cocamidopropyl Betaine.',
    additionalInfo: 'Non-comedogenic. Suitable for daily use.',
  },
  {
    name: 'Niacinamide 10% Serum 30ml',
    description: 'Brightening serum with 10% niacinamide to reduce pores, even skin tone, and improve texture.',
    shortDescription: 'Brightening & pore refining',
    badge: 'cream',
    tags: ['niacinamide', 'serum', 'brightening', 'vitamin b3'],
    price: 599,
    oldPrice: 749,
    stock: 170,
    isFeatured: true,
    isNewArrival: true,
    howToUse: 'Apply 3-4 drops to clean face after toner, before moisturizer. Use AM and PM.',
    sideEffects: 'Tingling sensation initially. Rare: mild redness.',
    ingredients: 'Niacinamide 10%, Hyaluronic Acid, Aloe Barbadensis, Panthenol.',
    additionalInfo: 'Pairs well with hyaluronic acid and SPF. Do not mix with vitamin C.',
  },
  {
    name: 'Benzoyl Peroxide 5% Gel 25g',
    description: 'Powerful acne treatment gel for moderate to severe acne. Kills acne bacteria and reduces inflammation.',
    shortDescription: 'Strong acne treatment',
    badge: 'cream',
    tags: ['benzoyl peroxide', 'acne', 'gel', 'treatment'],
    price: 349,
    oldPrice: 449,
    stock: 190,
    howToUse: 'Apply small amount to affected areas once daily. Can increase to twice daily as tolerated.',
    sideEffects: 'Dryness, peeling, redness. Start with 2.5% if sensitive.',
    ingredients: 'Benzoyl Peroxide 5%, Carbomer, Dimethicone, Glycerin.',
    additionalInfo: 'Can bleach fabrics. Avoid contact with hair and colored clothing.',
  },
]

const BLOGS = [
  {
    title: 'Understanding Insomnia: Causes, Symptoms, and Treatment Options',
    content: 'Insomnia affects millions of people worldwide. In this comprehensive guide, we explore the various causes of insomnia including stress, anxiety, medical conditions, and lifestyle factors. Learn about effective treatment options from cognitive behavioral therapy to medication, and discover practical tips for improving your sleep hygiene.',
    excerpt: 'Comprehensive guide to understanding and treating insomnia effectively.',
    category: 'Advices',
    image: '',
    author: 'Admin',
    isPublished: true,
  },
  {
    title: 'Natural vs Prescription Sleep Aids: What You Need to Know',
    content: 'Choosing between natural and prescription sleep aids can be overwhelming. This article breaks down the differences between melatonin, herbal supplements, and prescription medications like zolpidem. We discuss efficacy, side effects, safety profiles, and help you make an informed decision with your healthcare provider.',
    excerpt: 'Compare natural and prescription sleep aids to find the right option for you.',
    category: 'Advices',
    image: '',
    author: 'Admin',
    isPublished: true,
  },
  {
    title: 'The Role of Vitamins in Mental Health',
    content: 'Vitamins play a crucial role in brain function and mental health. Vitamin D deficiency has been linked to depression, while B vitamins are essential for neurotransmitter production. This article explores the science behind nutritional psychiatry and how proper supplementation can support mental wellbeing.',
    excerpt: 'How essential vitamins impact your mental health and wellbeing.',
    category: 'News',
    image: '',
    author: 'Admin',
    isPublished: true,
  },
  {
    title: 'Managing Chronic Pain Without Medication',
    content: 'Chronic pain affects 1 in 5 adults globally. While painkillers provide relief, there are many complementary approaches to pain management. This guide covers physical therapy, acupuncture, meditation, exercise, and dietary changes that can help reduce pain and improve quality of life alongside or instead of medication.',
    excerpt: 'Non-medication approaches to managing chronic pain effectively.',
    category: 'Consultation',
    image: '',
    author: 'Admin',
    isPublished: true,
  },
  {
    title: 'Antibiotic Resistance: Why You Must Complete Your Course',
    content: 'Antibiotic resistance is one of the biggest threats to global health. This article explains why it is critical to complete your full course of antibiotics as prescribed, even if you feel better. We discuss how bacteria develop resistance, the impact on public health, and what you can do to help fight this crisis.',
    excerpt: 'Understanding antibiotic resistance and the importance of completing treatment.',
    category: 'Announcements',
    image: '',
    author: 'Admin',
    isPublished: true,
  },
  {
    title: 'Skincare Routine for Acne-Prone Skin',
    content: 'Building an effective skincare routine for acne-prone skin requires the right products and consistency. This comprehensive guide covers cleansing, treatment, moisturizing, and sun protection. Learn about ingredients like salicylic acid, benzoyl peroxide, and niacinamide, and how to incorporate them without irritating your skin.',
    excerpt: 'Step-by-step skincare routine designed specifically for acne-prone skin.',
    category: 'Advices',
    image: '',
    author: 'Admin',
    isPublished: true,
  },
  {
    title: 'The Complete Guide to Omega-3 Supplements',
    content: 'Omega-3 fatty acids are essential for heart, brain, and joint health. This guide explains the difference between EPA and DHA, how to choose a quality fish oil supplement, recommended dosages, and the latest research on omega-3 benefits for various health conditions.',
    excerpt: 'Everything you need to know about omega-3 supplements and their benefits.',
    category: 'Development',
    image: '',
    author: 'Admin',
    isPublished: true,
  },
  {
    title: 'Understanding Anxiety: Types, Symptoms, and Modern Treatments',
    content: 'Anxiety disorders are the most common mental health conditions worldwide. This in-depth article covers generalized anxiety disorder, panic disorder, social anxiety, and specific phobias. Learn about treatment options including SSRIs, benzodiazepines, therapy, and lifestyle modifications.',
    excerpt: 'Comprehensive overview of anxiety disorders and available treatment options.',
    category: 'Consultation',
    image: '',
    author: 'Admin',
    isPublished: true,
  },
]

const CATEGORY_MAP = {
  'Sleeping Pills': ['Zolpidem 10mg Tablets', 'Melatonin 5mg Sleep Gummies', 'Eszopiclone 2mg Tablets', 'Diphenhydramine 25mg Sleep Capsules', 'Ramelteon 8mg Tablets'],
  'Painkillers': ['Ibuprofen 400mg Tablets', 'Acetaminophen 500mg Extra Strength', 'Naproxen 250mg Tablets', 'Tramadol 50mg Capsules', 'Diclofenac Gel 30g'],
  'Anxiety Pills': ['Alprazolam 0.5mg Tablets', 'Sertraline 50mg Tablets', 'L-Theanine 200mg Capsules', 'Clonazepam 0.5mg Tablets', 'Ashwagandha 500mg Capsules'],
  'Vitamins & Supplements': ['Vitamin D3 2000IU Softgels', 'Omega-3 Fish Oil 1000mg', 'Multivitamin Daily Formula', 'Vitamin B12 1000mcg Sublingual', 'Magnesium Glycinate 400mg'],
  'Antibiotics': ['Amoxicillin 500mg Capsules', 'Azithromycin 500mg Tablets', 'Ciprofloxacin 500mg Tablets', 'Doxycycline 100mg Capsules', 'Metronidazole 400mg Tablets'],
  'Skin Care': ['Tretinoin Cream 0.05% 20g', 'Clindamycin 1% Gel 30g', 'Hydrocortisone 1% Cream 30g', 'Salicylic Acid 2% Face Wash 100ml', 'Niacinamide 10% Serum 30ml', 'Benzoyl Peroxide 5% Gel 25g'],
}

const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    role: 'Verified Customer',
    text: 'Painomed has been a lifesaver! The ordering process is so smooth and my medications arrive right on time every single time.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Regular Customer',
    text: 'I love the variety of vitamins and supplements available. The quality is top-notch and prices are very reasonable compared to other pharmacies.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Healthcare Professional',
    text: 'As a nurse, I recommend Painomed to my patients. Their prescription service is reliable and the delivery is always discreet and prompt.',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'Verified Buyer',
    text: 'The sleep aids I ordered worked perfectly. Customer service was very helpful in guiding me to the right product for my needs.',
    rating: 4,
  },
  {
    name: 'Priya Sharma',
    role: 'Happy Customer',
    text: 'Finally found a pharmacy I can trust! The skincare products are genuine and the prices beat everything else online.',
    rating: 5,
  },
]

const SERVICES = [
  {
    title: 'Prescription Medicines',
    description: 'Safe and authentic prescription medications delivered to your doorstep with pharmacist verification and expert guidance.',
    icon: 'fa-solid fa-prescription-bottle-medical',
    order: 1,
  },
  {
    title: 'Wellness Supplements',
    description: 'Premium vitamins, minerals, and natural supplements to support your overall health and fill nutritional gaps.',
    icon: 'fa-solid fa-leaf',
    order: 2,
  },
  {
    title: 'Skincare Solutions',
    description: 'Dermatologist-approved skincare products including treatments for acne, aging, and sensitive skin conditions.',
    icon: 'fa-solid fa-spa',
    order: 3,
  },
  {
    title: 'Free Home Delivery',
    description: 'Fast and free delivery across the country with discreet packaging and real-time order tracking for your convenience.',
    icon: 'fa-solid fa-truck',
    order: 4,
  },
  {
    title: '24/7 Pharmacist Support',
    description: 'Round-the-clock access to licensed pharmacists for medication advice, dosage guidance, and health consultations.',
    icon: 'fa-solid fa-headset',
    order: 5,
  },
  {
    title: 'Health Checkups',
    description: 'Comprehensive health screening packages and diagnostic test bookings with partnered laboratories near you.',
    icon: 'fa-solid fa-heart-pulse',
    order: 6,
  },
]

const TEAM_MEMBERS = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Chief Pharmacist',
    bio: 'Leading our pharmaceutical team with over 15 years of clinical pharmacy experience. Ensures all medications meet quality standards.',
    socialLinks: { facebook: '#', linkedin: '#', twitter: '#' },
    order: 1,
  },
  {
    name: 'Michael Chen',
    role: 'Operations Director',
    bio: 'Oversees supply chain and delivery operations. Dedicated to making healthcare accessible across every region we serve.',
    socialLinks: { facebook: '#', linkedin: '#', twitter: '#' },
    order: 2,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Customer Care Head',
    bio: 'Ensures every customer receives exceptional service. Leads our support team to provide timely and helpful responses.',
    socialLinks: { facebook: '#', instagram: '#', linkedin: '#' },
    order: 3,
  },
  {
    name: 'Dr. Priya Sharma',
    role: 'Clinical Advisor',
    bio: 'Board-certified physician providing medical oversight and ensuring our product recommendations are clinically sound.',
    socialLinks: { linkedin: '#', twitter: '#' },
    order: 4,
  },
]

const placeholderImages = [
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
  'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400',
  'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400',
  'https://images.unsplash.com/photo-1607619056574-7b8d3ee1c2b5?w=400',
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400',
  'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400',
  'https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=400',
  'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400',
  'https://images.unsplash.com/photo-1616675280406-0c0df0cbf9e8?w=400',
  'https://images.unsplash.com/photo-1559190394-df5a28aab5c5?w=400',
]

const seedAll = async () => {
  try {
    console.log('\n📦 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected\n')

    // ── 1. Seed Admin ─────────────────────────────────
    console.log('━━━ 1. Admin User ━━━')
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL })
    if (existingAdmin) {
      console.log(`ℹ️  Admin already exists: ${ADMIN_EMAIL}`)
    } else {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
      })
      console.log(`✅ Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
    }

    // ── 2. Seed Categories ────────────────────────────
    console.log('\n━━━ 2. Categories ━━━')
    await seedCategories()

    // ── 3. Seed Products ──────────────────────────────
    console.log('\n━━━ 3. Products ━━━')
    const categories = await Category.find({})
    let productCount = 0

    for (const category of categories) {
      const productNames = CATEGORY_MAP[category.name]
      if (!productNames) {
        console.log(`⚠️  No products mapped for category: ${category.name}`)
        continue
      }

      for (const productName of productNames) {
        const productData = PRODUCTS.find(p => p.name === productName)
        if (!productData) {
          console.log(`⚠️  Product data not found: ${productName}`)
          continue
        }

        const exists = await Product.findOne({ name: productName })
        if (exists) {
          console.log(`ℹ️  Already exists: ${productName}`)
          continue
        }

        await Product.create({
          ...productData,
          category: category._id,
          image: placeholderImages[productCount % placeholderImages.length],
          images: [],
          brand: 'Painomed Healthcare',
          sku: `PHM-${String(productCount + 1).padStart(4, '0')}`,
        })
        console.log(`✅ Product created: ${productName} [${category.name}]`)
        productCount++
      }
    }

    if (productCount === 0) {
      const totalProducts = await Product.countDocuments({})
      console.log(`ℹ️  All ${totalProducts} products already exist in database`)
    } else {
      console.log(`\n✅ Total ${productCount} new products seeded`)
    }

    // ── 4. Seed Blogs ─────────────────────────────────
    console.log('\n━━━ 4. Blog Posts ━━━')
    let blogCount = 0
    for (const blogData of BLOGS) {
      const exists = await Blog.findOne({ title: blogData.title })
      if (exists) {
        console.log(`ℹ️  Already exists: ${blogData.title}`)
        continue
      }
      await Blog.create({
        ...blogData,
        image: placeholderImages[blogCount % placeholderImages.length],
      })
      console.log(`✅ Blog created: ${blogData.title}`)
      blogCount++
    }

    if (blogCount === 0) {
      const totalBlogs = await Blog.countDocuments({})
      console.log(`ℹ️  All ${totalBlogs} blog posts already exist`)
    } else {
      console.log(`\n✅ Total ${blogCount} new blog posts seeded`)
    }

    // ── 5. Seed Testimonials ──────────────────────────
    console.log('\n━━━ 5. Testimonials ━━━')
    let testimonialCount = 0
    for (const testimonialData of TESTIMONIALS) {
      const exists = await Testimonial.findOne({ name: testimonialData.name, text: testimonialData.text })
      if (exists) {
        console.log(`ℹ️  Already exists: ${testimonialData.name}`)
        continue
      }
      await Testimonial.create({
        ...testimonialData,
        image: placeholderImages[testimonialCount % placeholderImages.length],
      })
      console.log(`✅ Testimonial created: ${testimonialData.name}`)
      testimonialCount++
    }

    if (testimonialCount === 0) {
      const totalTestimonials = await Testimonial.countDocuments({})
      console.log(`ℹ️  All ${totalTestimonials} testimonials already exist`)
    } else {
      console.log(`\n✅ Total ${testimonialCount} new testimonials seeded`)
    }

    // ── 6. Seed Services ──────────────────────────────
    console.log('\n━━━ 6. Services ━━━')
    let serviceCount = 0
    for (const serviceData of SERVICES) {
      const exists = await Service.findOne({ title: serviceData.title })
      if (exists) {
        console.log(`ℹ️  Already exists: ${serviceData.title}`)
        continue
      }
      await Service.create(serviceData)
      console.log(`✅ Service created: ${serviceData.title}`)
      serviceCount++
    }
    if (serviceCount === 0) {
      const totalServices = await Service.countDocuments({})
      console.log(`ℹ️  All ${totalServices} services already exist`)
    } else {
      console.log(`\n✅ Total ${serviceCount} new services seeded`)
    }

    // ── 7. Seed Team Members ──────────────────────────
    console.log('\n━━━ 7. Team Members ━━━')
    let teamCount = 0
    for (const memberData of TEAM_MEMBERS) {
      const exists = await Team.findOne({ name: memberData.name })
      if (exists) {
        console.log(`ℹ️  Already exists: ${memberData.name}`)
        continue
      }
      await Team.create({
        ...memberData,
        image: placeholderImages[teamCount % placeholderImages.length],
      })
      console.log(`✅ Team member created: ${memberData.name}`)
      teamCount++
    }
    if (teamCount === 0) {
      const totalTeam = await Team.countDocuments({})
      console.log(`ℹ️  All ${totalTeam} team members already exist`)
    } else {
      console.log(`\n✅ Total ${teamCount} new team members seeded`)
    }

    // ── Summary ───────────────────────────────────────
    const totalUsers = await User.countDocuments({ role: 'admin' })
    const totalCategories = await Category.countDocuments({})
    const totalProducts = await Product.countDocuments({})
    const totalBlogs = await Blog.countDocuments({})
    const totalTestimonials = await Testimonial.countDocuments({})
    const totalServices = await Service.countDocuments({})
    const totalTeam = await Team.countDocuments({})

    console.log('\n' + '═'.repeat(40))
    console.log('📊 SEED SUMMARY')
    console.log('═'.repeat(40))
    console.log(`👤  Admins:        ${totalUsers}`)
    console.log(`📁  Categories:    ${totalCategories}`)
    console.log(`📦  Products:      ${totalProducts}`)
    console.log(`📝  Blog Posts:    ${totalBlogs}`)
    console.log(`⭐  Testimonials:  ${totalTestimonials}`)
    console.log(`🛠️  Services:      ${totalServices}`)
    console.log(`👥  Team Members:  ${totalTeam}`)
    console.log('═'.repeat(40))
    console.log(`🔑  Admin Login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
    console.log('═'.repeat(40) + '\n')

  } catch (error) {
    console.error('\n❌ Seed error:', error.message)
    console.error(error)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 MongoDB connection closed\n')
    process.exit(0)
  }
}

seedAll()
