import express from 'express';
import Plan from '../models/Plan.js';

const router = express.Router();

// @desc    Get all plans
// @route   GET /api/plans
// @access  Public
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find({});
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a plan
// @route   POST /api/plans
// @access  Public
router.post('/', async (req, res) => {
  const {
    goalName,
    deadline,
    dailyHours,
    topics,
    learningStyle,
    difficulty,
    schedule,
  } = req.body;

  try {
    const plan = new Plan({
      goalName,
      deadline,
      dailyHours,
      topics,
      learningStyle,
      difficulty,
      schedule,
    });

    const createdPlan = await plan.save();
    res.status(201).json(createdPlan);
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get plan by ID
// @route   GET /api/plans/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (plan) {
      res.json(plan);
    } else {
      res.status(404).json({ message: 'Plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete plan
// @route   DELETE /api/plans/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (plan) {
      await plan.deleteOne();
      res.json({ message: 'Plan removed' });
    } else {
      res.status(404).json({ message: 'Plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update plan (e.g., tasks completed)
// @route   PATCH /api/plans/:id
// @access  Public
router.patch('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (plan) {
      plan.completedTasks = req.body.completedTasks || plan.completedTasks;
      plan.progress = req.body.progress || plan.progress;
      plan.schedule = req.body.schedule || plan.schedule; // Specifically for updating the AI schedule later if needed

      const updatedPlan = await plan.save();
      res.json(updatedPlan);
    } else {
      res.status(404).json({ message: 'Plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
