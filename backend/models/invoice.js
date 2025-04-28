import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    userEmail: {type: String, required: true, trim: true},

    invoiceNumber: { type: String, required: true },

    clientName: { type: String, required: true },
    clientAddress: { type: String, required: true },
    clientPhoneNo: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientType: { type: String, enum: ['company', 'individual'], required: true }, 
    clientCifcnp: { type: String, required: true },

    vendorName: { type: String, required: true },
    vendorAddress: { type: String, required: true },
    vendorPhoneNo: { type: String, required: true },
    vendorEmail: { type: String, required: true },
    vendorType: { type: String, enum: ['company', 'individual'], required: true },
    vendorCifcnp: { type: String, required: true },

    issue_date: { type: Date, required: true },
    due_date: { type: Date, required: true },

    items: [
        {
            itemName: { type: String, required: true },
            unitPrice: { type: Number, required: true }, 
            quantity: { type: Number, required: true }   
        }
    ],

    tax: { type: Number, required: true },
    total: { type: Number, required: true },

    timeStatus: { type: String, default:"Pending"},
    paymentStatus: { type: String, default:"Unpaid"},
    paymentDate:{ type: Date}
});



export default mongoose.model('Invoice', invoiceSchema);
