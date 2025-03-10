import express from 'express';
import Vendor from '../models/vendor.js';

const vendorRoute = express.Router();

vendorRoute.post("/create", async (req, res) => {
    try {
        const vendor = new Vendor(req.body);

        // Log the vendor data for debugging purposes
        console.log('Vendor Data:', req.body);

        // Save the vendor to the database
        await vendor.save();
        res.status(201).json(vendor);
    } catch (error) {
        console.error('Error:', error); // Log the error for debugging

        // Return more detailed error message
        return res.status(400).json({ message: error.message || 'Something went wrong while creating the vendor.' });
    }
});

// Get all vendors
vendorRoute.get('/create', async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Get a single vendor by ID
vendorRoute.get('/:id', async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        res.json(vendor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});






// Update a vendor
vendorRoute.put('/:id', async (req, res) => {
    try {
        const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVendor) return res.status(404).json({ message: 'Vendor not found' });
        res.json(updatedVendor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a vendor
vendorRoute.delete('/:id', async (req, res) => {
    try {
        const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
        if (!deletedVendor) return res.status(404).json({ message: 'Vendor not found' });
        res.json({ message: 'Vendor deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default vendorRoute;