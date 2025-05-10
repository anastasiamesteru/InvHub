import express from 'express';
import Invoice from '../models/invoice.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const invoiceRoute = express.Router();

// Get all invoices
invoiceRoute.get("/getall", verifyToken, async (req, res) => {
    try {
        const invoices = await Invoice.find({ userEmail: req.user.email });

        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get one invoice 
invoiceRoute.get("/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id.trim();

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

        const invoice = await Invoice.findOne({ _id: id, userEmail: req.user.email });

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.status(200).json(invoice);
    } catch (error) {
        console.error("Error fetching invoice:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Create a new invoice
invoiceRoute.post("/create",verifyToken, async (req, res) => {
    try {
        const invoice = new Invoice({
                    ...req.body,
                    userEmail: req.user.email,
                });
        await invoice.save();
        res.status(201).json(invoice);
    } catch (error) {
        console.error('Error:', error);

        return res.status(400).json({ message: error.message || 'Something went wrong while creating the invoice.' });
    }
});

/// Update an invoice by ID
invoiceRoute.put("/:id", verifyToken,async (req, res) => {
    try {
        const id = req.params.id.trim();

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

        const updatedInvoice = await Invoice.findOneAndUpdate(
            { _id: id, userEmail: req.user.email }, 
            req.body, 
            { new: true, runValidators: true } 
        );
        if (!updatedInvoice) {
            return res.status(404).json({ error: "Invoice not found or access denied" });
        }

        // Successfully updated invoice
        res.status(200).json(updatedInvoice);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});


// Delete an invoice by ID
invoiceRoute.delete('/:id',verifyToken, async (req, res) => {
    try {
        const id = req.params.id.trim();

        const deletedInvoice = await Invoice.findOneAndDelete({ _id: id, userEmail: req.user.email });

        if (!deletedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting invoice', error: error.message });
    }
});

invoiceRoute.patch('/:id', verifyToken, async (req, res) => {
    const id = req.params.id.trim();
    const { paymentStatus, paymentDate, timeStatus, total } = req.body;

    try {
        const invoice = await Invoice.findOne({ _id: id, userEmail: req.user.email });

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            id,
            {
                paymentStatus: paymentStatus,
                paymentDate: paymentDate,
                timeStatus: timeStatus,
                total: total
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
