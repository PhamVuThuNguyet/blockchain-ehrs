const { Schema, model } = require('mongoose');

const NotificationSchema = new Schema({
  patientId: { type: String, required: true },
  content: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = model('Notification', NotificationSchema);
