import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reportNumber: { type: String, required: true },

    title: { type: String, required: true }, 
    startDate: { type: Date, required: true },
    endDate: {  type: Date,  required: true}, 
    indicators: {
        paymentStatus: {
            numberOfPaidInvoices: { type: Number },
            numberOfUnpaidInvoices: { type: Number },
            numberOfPendingInvoices: { type: Number },
            percentPaid: { type: Number },
            percentUnpaid: { type: Number },
            percentPending: { type: Number },
        },
        
        overdueAnalysis: {
            numberOfInvoicesPaidOnTime: { type: Number },
            numberOfOverdueInvoices: { type: Number },
            numberOfInvoicesOverdue30Days: { type: Number },
            numberOfInvoicesOverdue60Days: { type: Number },
            numberOfInvoicesOverdue90PlusDays: { type: Number },
            percentOverdue: { type: Number },
            percentOverdue30: { type: Number },
            percentOverdue60: { type: Number },
            percentOverdue90Plus: { type: Number },
        },
        
        invoicePatterns: {
            averageDaysToPayment: { type: Number },
            medianDaysToPayment: { type: Number },
            modeOfPaymentDelays: { type: Number },
        },
        
    },
});

export default mongoose.model('Report', reportSchema);
