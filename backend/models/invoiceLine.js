import mongoose from 'mongoose';


const invoiceLineSchema = new mongoose.Schema({
    invoice_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true }, 
    item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }, 
    item_name: { type: String, required: true }, 
    item_price: { type: Number, required: true, min: 0 }, 
    item_um: { type: String, required: true, enum: ['kg', 'pcs', 'liters', 'hour', 'day', 'service'] }, 
    quantity: { type: Number, required: true, min: 1 }, 
    total_price: { type: Number, required: true, min: 0 } 
});

// Automatically calculate `total_price` before saving
invoiceLineSchema.pre('save', function (next) {
    this.total_price = this.quantity * this.item_price;
    next();
});

export default mongoose.model('InvoiceLine', invoiceLineSchema);  

