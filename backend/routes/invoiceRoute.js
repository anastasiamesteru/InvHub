const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice'); 
const InvoiceLine = require('../models/invoiceLine');

// Get all invoices and populate invoice lines with related item details
router.get('/', async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate({
                path: 'invoice_lines', // Populate the invoice_lines field
                populate: {
                    path: 'item_id', // Populate item_id in the InvoiceLine
                    select: 'name price type' // Select the name, price, and type fields
                }
            });

        if (invoices.length === 0) {
            return res.status(404).json({ message: 'No invoices found' });
        }

        res.status(200).json(invoices);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching invoices', error: err.message });
    }
});

// Create a new invoice
router.post('/', async (req, res) => {
    const { client, vendor, issue_date, due_date, invoice_lines } = req.body;

    try {
        // First, calculate the total price based on the invoice lines
        let total = 0;
        for (const line of invoice_lines) {
            const invoiceLine = await InvoiceLine.findById(line);
            total += invoiceLine.total_price; // Sum up the total_price from invoice lines
        }

        // Create the invoice
        const newInvoice = new Invoice({
            client,
            vendor,
            issue_date,
            due_date,
            invoice_lines,
            total
        });

        // Save the invoice to the database
        await newInvoice.save();

        res.status(201).json({ message: 'Invoice created successfully', invoice: newInvoice });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating invoice', error: err.message });
    }
});

//Get a single invoice by its ID, including the invoice lines and item details
router.get('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate({
                path: 'invoice_lines', // Populate the invoice_lines field
                populate: {
                    path: 'item_id', // Populate item_id in the InvoiceLine
                    select: 'name price type' // Select the name, price, and type fields
                }
            });

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json(invoice);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching invoice', error: err.message });
    }
});

//Update an invoice by ID
router.put('/:id', async (req, res) => {
    const { client, vendor, issue_date, due_date, invoice_lines } = req.body;

    try {
        // Recalculate the total based on the updated invoice lines
        let total = 0;
        for (const line of invoice_lines) {
            const invoiceLine = await InvoiceLine.findById(line);
            total += invoiceLine.total_price;
        }

        // Find the invoice and update it
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            {
                client,
                vendor,
                issue_date,
                due_date,
                invoice_lines,
                total
            },
            { new: true }
        );

        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json({ message: 'Invoice updated successfully', invoice: updatedInvoice });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating invoice', error: err.message });
    }
});

// Delete an invoice by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);

        if (!deletedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting invoice', error: err.message });
    }
});

module.exports = router;
