const express = require('express');
const Incident = require('../models/Incident');
const auth = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const totalIncidents = await Incident.countDocuments();
    const openIncidents = await Incident.countDocuments({ status: 'Open' });
    const criticalIncidents = await Incident.countDocuments({ severity: 'Critical' });
    const resolvedIncidents = await Incident.countDocuments({ status: 'Resolved' });

    const severityData = await Incident.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalIncidents,
      openIncidents,
      criticalIncidents,
      resolvedIncidents,
      resolutionRate: totalIncidents > 0 ? ((resolvedIncidents / totalIncidents) * 100).toFixed(2) : 0,
      severityBreakdown: severityData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get incidents by type
router.get('/incidents-by-type', auth, async (req, res) => {
  try {
    const incidentsByType = await Incident.aggregate([
      {
        $group: {
          _id: '$incidentType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(incidentsByType);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get severity trends
router.get('/severity-trends', auth, async (req, res) => {
  try {
    const trends = await Incident.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$dateOfIncident' } },
            severity: '$severity'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    res.json(trends);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;