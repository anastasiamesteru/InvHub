import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    userEmail: {type: String, required: true, trim: true},

    reportNumber: String,
    description:String,
    title: String,
    startDate: Date,
    endDate: Date,
    indicators: {
        paymentStatus: {
            numberOfPaidInvoices: { type: Number },
            numberOfUnpaidInvoices: { type: Number },

            percentPaid: { type: Number },
            percentUnpaid: { type: Number },
        },
        overdueAnalysis: {
            numberOfOnTimeInvoices: { type: Number },
            numberOfOverdueInvoices: { type: Number },

            percentOverdue: { type: Number },
            percentOnTime: { type: Number },
        },
        invoicePatterns: {
            averageDaysToPayment: { type: Number },
            medianDaysToPayment: { type: Number },
            modeOfPaymentDelays: { type: Number },
        },
        invoiceEntities: {
            numberOfIndividualClients: { type: Number },
            numberOfCompanyClients: { type: Number },
            numberOfIndividualVendors: { type: Number },
            numberOfCompanyVendors: { type: Number },
            numberOfProducts: { type: Number },
            numberOfServices: { type: Number },

            percentIndividualClients: {type:Number},
            percentCompanyClients: {type:Number},
            percentIndividualVendors: {type:Number},
            percentCompanyVendors: {type:Number},
            percentProducts: {type:Number},
            percentPercent: {type:Number},

        },
    },
    selectedCheckboxes: {
        paymentStatus: {
            checkednumberOfPaidInvoices: { type: Boolean },
            checkednumberOfUnpaidInvoices: { type: Boolean },
            checkedpercentPaid: { type: Boolean },
            checkedpercentUnpaid: { type: Boolean },
        },
        overdueAnalysis: {
            checkednumberOfOnTimeInvoices: { type: Boolean },
            checkednumberOfOverdueInvoices: { type: Boolean },
            checkedPercentOverdue:{ type: Boolean },
            checkedpercentOnTime: { type: Boolean },
        },
        invoicePatterns: {
            checkedaverageDaysToPayment: { type: Boolean },
            checkedmedianDaysToPayment: { type: Boolean },
            checkedmodeOfPaymentDelays: { type: Boolean },
        },
        invoiceEntities: {
            checkednumberOfIndividualClients: { type: Number },
            checkednumberOfCompanyClients: { type: Number },
            checkednumberOfIndividualVendors: { type: Number },
            checkednumberOfCompanyVendors: { type: Number },
            checkednumberOfProducts: { type: Number },
            checkednumberOfServices: { type: Number },

            checkedpercentIndividualClients: {type:Number},
            checkedpercentCompanyClients: {type:Number},
            checkedpercentIndividualVendors: {type:Number},
            checkedpercentCompanyVendors: {type:Number},
            checkedpercentProducts: {type:Number},
            checkedpercentServices: {type:Number},

        },
    },
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
