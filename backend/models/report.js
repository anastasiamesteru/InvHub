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
            percentService: {type:Number},

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
            checkednumberOfIndividualClients: { type: Boolean },
            checkednumberOfCompanyClients: { type: Boolean },
            checkednumberOfIndividualVendors: { type: Boolean },
            checkednumberOfCompanyVendors: { type: Boolean },
            checkednumberOfProducts: { type: Boolean },
            checkednumberOfServices: { type: Boolean },

            checkedpercentIndividualClients: {type:Boolean},
            checkedpercentCompanyClients: {type:Boolean},
            checkedpercentIndividualVendors: {type:Boolean},
            checkedpercentCompanyVendors: {type:Boolean},
            checkedpercentProducts: {type:Boolean},
            checkedpercentServices: {type:Boolean},

        },
    },
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
