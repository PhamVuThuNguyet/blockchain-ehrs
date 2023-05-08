const { Schema, model } = require('mongoose');
const { REQUEST_STATUS } = require('../constants');

const RequestSchema = new Schema({
  patientId: { type: String, required: true },
  doctor: { type: Schema.Types.Mixed, required: true },
  hospitalId: { type: String, required: true },
  status: { type: String, default: REQUEST_STATUS.PENDING }
}, {
  timestamps: true
});

module.exports = model('Request', RequestSchema);
