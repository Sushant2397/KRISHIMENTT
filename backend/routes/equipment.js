const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');

// Get all equipment listings
router.get('/', async (req, res) => {
  try {
    const equipment = await Equipment.find().sort({ createdAt: -1 });
    res.json(equipment);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new equipment listing
router.post('/', async (req, res) => {
  try {
    const { title, price, description, category, condition, images, location, seller } = req.body;
    
    const newEquipment = new Equipment({
      title,
      price,
      description,
      category,
      condition,
      images: images || [],
      location,
      seller: seller || { name: 'Anonymous', rating: 0 },
    });

    const savedEquipment = await newEquipment.save();
    res.status(201).json(savedEquipment);
  } catch (error) {
    console.error('Error creating equipment:', error);
    res.status(500).json({ message: 'Error creating equipment listing' });
  }
});

module.exports = router;
