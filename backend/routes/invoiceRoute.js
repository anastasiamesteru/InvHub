import express from 'express';
import Invoice from '../models/invoice.js';

const invoiceRoute = express.Router();

invoiceRoute.get("/getall", async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
})

// Create a new invoice
invoiceRoute.post('/create', async (req, res) => {
    try {
      // Get invoice data from the request body
      const {
        invoiceNumber,
        clientName, clientAddress, clientPhoneNo, clientEmail, clientType, clientCifcnp,
        vendorName, vendorAddress, vendorPhoneNo, vendorEmail, vendorType, vendorCifcnp,
        issue_date, due_date,
        items,tax, total,
      } = req.body;
  
      // Create a new invoice document
      const newInvoice = new Invoice({
        invoiceNumber,
        clientName, clientAddress, clientPhoneNo, clientEmail, clientType, clientCifcnp,
        vendorName, vendorAddress, vendorPhoneNo, vendorEmail, vendorType, vendorCifcnp,
        issue_date, due_date,
        items, tax, total,
      });
  
      await newInvoice.save();
  
      res.status(201).json({
        message: 'Invoice created successfully',
        invoice: newInvoice,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create invoice' });
    }
  });



//Update an invoice by ID
invoiceRoute.put('/:id', async (req, res) => {
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
invoiceRoute.delete('/:id', async (req, res) => {
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

export default invoiceRoute;