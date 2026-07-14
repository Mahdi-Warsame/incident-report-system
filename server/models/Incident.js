const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  incidentType: {
    type: String,
    required: true,
    enum: [
      'Patient Safety',
      'Staff Safety',
      'Equipment Failure',
      'Medication Error',
      'Fall',
      'Infection Control',
      'Communication Issue',
      'Other'
    ]
  },
  severity: {
    type: String,
    required: true,
    enum: ['Critical', 'High', 'Medium', 'Low']
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dateOfIncident: {
    type: Date,
    required: true
  },
  timeOfIncident: {
    type: String,
    required: true
  },
  affectedIndividuals: {
    type: Number,
    default: 1
  },
  actionsTaken: String,
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  priority: {
    type: String,
    enum: ['Urgent', 'High', 'Medium', 'Low'],
    default: 'Medium'
  },
  tags: [String],
  attachments: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Incident', incidentSchema);