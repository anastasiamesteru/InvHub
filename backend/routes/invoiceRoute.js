import express from 'express';
import Invoice from '../models/invoice.js';

const invoiceRoute = express.Router();

// Get all invoices
invoiceRoute.get("/getall", async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Create a new invoice
invoiceRoute.post('/create', async (req, res) => {

    try {
        const {
            invoiceNumber,
            clientName, clientAddress, clientPhoneNo, clientEmail, clientType, clientCifcnp,
            vendorName, vendorAddress, vendorPhoneNo, vendorEmail, vendorType, vendorCifcnp,
            issue_date, due_date,
            items, tax, total,
            timeStatus,
            paymentStatus,
            paymentDate
        } = req.body;

        
        const newInvoice = new Invoice({
            invoiceNumber,
            clientName, clientAddress, clientPhoneNo, clientEmail, clientType, clientCifcnp,
            vendorName, vendorAddress, vendorPhoneNo, vendorEmail, vendorType, vendorCifcnp,
            issue_date, due_date,
            items, tax, total,
            timeStatus,
            paymentStatus,
            paymentDate
        });

        await newInvoice.save();

        res.status(201).json({ message: 'Invoice created successfully', invoice: newInvoice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create invoice' });
    }
});

// Update an invoice by ID
invoiceRoute.put('/:id', async (req, res) => {
    try {
        const { 
            clientName, clientAddress, clientPhoneNo, clientEmail, clientType, clientCifcnp,
            vendorName, vendorAddress, vendorPhoneNo, vendorEmail, vendorType, vendorCifcnp,
            issue_date, due_date, 
            items, tax, total,
             timeStatus, paymentStatus, paymentDate
        } = req.body;

       
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            {
                clientName, clientAddress, clientPhoneNo, clientEmail, clientType, clientCifcnp,
                vendorName, vendorAddress, vendorPhoneNo, vendorEmail, vendorType, vendorCifcnp,
                issue_date, due_date,
                items, tax, total,
                timeStatus,
                paymentStatus,
                paymentDate
            },
            { new: true }
        );

        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json({ message: 'Invoice updated successfully', invoice: updatedInvoice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating invoice', error: error.message });
    }
});

// Delete an invoice by ID
invoiceRoute.delete('/:id', async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);

        if (!deletedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting invoice', error: error.message });
    }
});

invoiceRoute.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { paymentStatus, paymentDate, timeStatus, total } = req.body;

    try {
        const invoice = await Invoice.findById(id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            id,
            { 
                paymentStatus: paymentStatus, 
                paymentDate: paymentDate, 
                timeStatus: timeStatus,  
                total:total
            },
            { new: true }  
        );

        res.json({
            success: true,
            message: 'Payment status and time status updated successfully',
            invoice: updatedInvoice  
        });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


export default invoiceRoute;
