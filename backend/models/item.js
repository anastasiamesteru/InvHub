import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String,},
    price: { type: Number, min:0, required:true },
    type: {
      type: String,
      enum: ['product', 'service'], 
      required: true,
    },
    um: { type: String},
  });
  
export default mongoose.model('Item', itemSchema);  
