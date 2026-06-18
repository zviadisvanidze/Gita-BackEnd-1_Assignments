const express = require('express');
const router = express.Router();
const Pot = require('../models/Pot');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');

router.use(requireAuth);

// GET /api/pots
router.get('/', async (req, res) => {
  try {
    const pots = await Pot.find({ userId: req.session.userId });
    res.json(pots);
  } catch (err) {
    res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
});

// POST /api/pots
router.post('/', async (req, res) => {
  try {
    const { name, target, theme } = req.body;

    if (!name || !target || !theme) {
      return res.status(400).json({ message: 'სავალდებულო ველები: name, target, theme' });
    }

    const pot = await Pot.create({
      userId: req.session.userId,
      name,
      target,
      saved: 0,
      theme
    });

    res.status(201).json(pot);
  } catch (err) {
    res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
});

// PUT /api/pots/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, target, theme } = req.body;

    const pot = await Pot.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      { name, target, theme },
      { new: true }
    );

    if (!pot) {
      return res.status(404).json({ message: 'ქოთანი ვერ მოიძებნა' });
    }

    res.json(pot);
  } catch (err) {
    res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
});

// DELETE /api/pots/:id
router.delete('/:id', async (req, res) => {
  try {
    const pot = await Pot.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId
    });

    if (!pot) {
      return res.status(404).json({ message: 'ქოთანი ვერ მოიძებნა' });
    }

    res.json({ message: 'ქოთანი წაშლილია' });
  } catch (err) {
    res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
});

// POST /api/pots/:id/add
router.post('/:id/add', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'თანხა უნდა იყოს 0-ზე მეტი' });
    }

    const user = await User.findOne({ userId: req.session.userId });
    if (amount > user.balance) {
      return res.status(400).json({ message: 'არასაკმარისი ბალანსი' });
    }

    const pot = await Pot.findOne({ _id: req.params.id, userId: req.session.userId });
    if (!pot) {
      return res.status(404).json({ message: 'ქოთანი ვერ მოიძებნა' });
    }

    pot.saved += amount;
    user.balance -= amount;

    await pot.save();
    await user.save();

    res.json({ pot, balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
});

// POST /api/pots/:id/withdraw
router.post('/:id/withdraw', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'თანხა უნდა იყოს 0-ზე მეტი' });
    }

    const pot = await Pot.findOne({ _id: req.params.id, userId: req.session.userId });
    if (!pot) {
      return res.status(404).json({ message: 'ქოთანი ვერ მოიძებნა' });
    }

    if (amount > pot.saved) {
      return res.status(400).json({ message: 'ქოთანში არასაკმარისი თანხაა' });
    }

    const user = await User.findOne({ userId: req.session.userId });

    pot.saved -= amount;
    user.balance += amount;

    await pot.save();
    await user.save();

    res.json({ pot, balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'სერვერის შეცდომა' });
  }
});

module.exports = router;
