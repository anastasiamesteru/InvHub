import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reportNumber: { type: String, required: true },

    title: { type: String, required: true }, 
    startDate: { type: Date, required: true },
    endDate: {  type: Date,  required: true}, 
    indicators: {
        paymentStatus: {
            numberOfPaidInvoices: { type: Number,default:null },
            numberOfUnpaidInvoices: { type: Number , default:null},
            percentPaid: { type: Number , default:null},
            percentUnpaid: { type: Number , default:null},
        },
        
        overdueAnalysis: {
            numberOfInvoicesPaidOnTime: { type: Number , default:null},
            numberOfOverdueInvoices: { type: Number , default:null},
            numberOfInvoicesOverdue30Days: { type: Number , default:null},
            numberOfInvoicesOverdue60Days: { type: Number , default:null},
            numberOfInvoicesOverdue90PlusDays: { type: Number , default:null},
            percentOverdue: { type: Number , default:null},
            percentOverdue30: { type: Number , default:null},
            percentOverdue60: { type: Number , default:null},
            percentOverdue90Plus: { type: Number , default:null},
        },
        
        invoicePatterns: {
            averageDaysToPayment: { type: Number , default:null},
            medianDaysToPayment: { type: Number , default:null},
            modeOfPaymentDelays: { type: Number , default:null},
        },
        
    },
});

export default mongoose.model('Report', reportSchema);
