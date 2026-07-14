const express = require('express');
const { body, validationResult } = require('express-validator');
const Incident = require('../models/Incident');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all incidents
router.get('/', auth, async (req, res) => {
  try {
    const { status, severity, type } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (type) filter.incidentType = type;

    const incidents = await Incident.find(filter)
      .populate('reportedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get incident by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reportedBy', 'firstName lastName email');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create incident
router.post('/', auth, [
  body('incidentType').notEmpty(),
  body('severity').notEmpty(),
  body('location').notEmpty(),
  body('description').notEmpty(),
  body('dateOfIncident').notEmpty(),
  body('timeOfIncident').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const incident = new Incident({
      ...req.body,
      reportedBy: req.userId
    });

    await incident.save();
    await incident.populate('reportedBy', 'firstName lastName email');

    res.status(201).json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update incident
router.put('/:id', auth, async (req, res) => {
  try {
    let incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    incident = await Incident.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('reportedBy', 'firstName lastName email');

    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete incident
router.delete('/:id', auth, async (req, res) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.json({ message: 'Incident deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;