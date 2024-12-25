const { Schema, model } = require('mongoose');

const otpSchema = new Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, require: true },
  expireAt: { type: Date, default: Date.now, expires: 600 },
});

module.exports = model('Otp', otpSchema);
