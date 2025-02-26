import express from 'express';
import InvoiceLine from '../models/invoiceLine.js';  
import Item from '../models/item.js';

const invoiceLineRoute = express.Router();

// Create a new invoice line
invoiceLineRoute.post('/', async (req, res) => {
    const { invoice_id, item_id, item_name, item_price, item_um, quantity } = req.body;

    try {
        // Create the new invoice line document
        const newInvoiceLine = new InvoiceLine({
            invoice_id,
            item_id,
            item_name,
            item_price,
            item_um,
            quantity,
        });

        // Save the invoice line
        await newInvoiceLine.save();
        res.status(201).json({ message: 'Invoice Line created successfully', newInvoiceLine });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating invoice line', error: err.message });
    }
});

// Get all invoice lines for an invoice, including item type
invoiceLineRoute.get('/:invoice_id', async (req, res) => {
    try {
        const invoiceLines = await InvoiceLine.find({ invoice_id: req.params.invoice_id })
            .populate('item_id', 'type');  // Populate the item type from the Item model

        if (invoiceLines.length === 0) {
            return res.status(404).json({ message: 'No invoice lines found for this invoice' });
        }

        // Add item type to each invoice line
        const invoiceLinesWithItemType = invoiceLines.map(line => ({
            ...line.toObject(),
            item_type: line.item_id.type  // Add item type to each invoice line
        }));

        res.status(200).json(invoiceLinesWithItemType);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching invoice lines', error: err.message });
    }
});

// Update an invoice line
invoiceLineRoute.put('/:id', async (req, res) => {
    const { item_name, item_price, item_um, quantity } = req.body;

    try {
        const updatedInvoiceLine = await InvoiceLine.findByIdAndUpdate(
            req.params.id, 
            { item_name, item_price, item_um, quantity },
            { new: true, runValidators: true } // Return the updated document and validate
        );

        if (!updatedInvoiceLine) {
            return res.status(404).json({ message: 'Invoice Line not found' });
        }

        res.status(200).json({ message: 'Invoice Line updated successfully', updatedInvoiceLine });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating invoice line', error: err.message });
    }
});

// Delete an invoice line
invoiceLineRoute.delete('/:id', async (req, res) => {
    try {
        const deletedInvoiceLine = await InvoiceLine.findByIdAndDelete(req.params.id);

        if (!deletedInvoiceLine) {
            return res.status(404).json({ message: 'Invoice Line not found' });
        }

        res.status(200).json({ message: 'Invoice Line deleted successfully', deletedInvoiceLine });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting invoice line', error: err.message });
    }
});

export default invoiceLineRoute;