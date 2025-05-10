import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, trim: true },

  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  type: {
    type: String,
    enum: ['company', 'individual'],
    required: true
  },
  cifcnp: {
    type: String,
    required: [true, 'CIF or CNP is required']
  }
});

export default mongoose.model('Vendor', vendorSchema);
