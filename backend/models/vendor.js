import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  userEmail: {type: String, required: true, trim: true},

  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  type: {
    type: String,
    enum: ['company', 'individual'],
    required: true
  },
  cifcnp: {
    type: String,
    required: [true, 'CIF or CNP is required'],
    validate: {
      validator: function (value) {
        if (this.type === 'company') {
          return /^\d+$/.test(value); 
        }
        if (this.type === 'individual') {
          return /^\d{13}$/.test(value); 
        }
        return true;
      },
      message: function (props) {
        if (this.type === 'company') {
          return 'Invalid CIF format for a company.';
        }
        return 'Invalid CNP format for an individual.';
      }
    }
  }
});

export default mongoose.model('Vendor', vendorSchema);
