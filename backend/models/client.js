import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
    client_id: { type: Number, unique: true }, 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    type: { type: String, enum: ['company', 'individual'], required: true },
    cif: { type: String, required: function () { return this.type === 'company'; } },
    cnp: { type: String, required: function () { return this.type === 'individual'; } },
  });

  export default mongoose.model('Client', clientSchema);  
  