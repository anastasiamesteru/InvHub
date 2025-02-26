import express from 'express';
import Vendor from '../models/vendor.js';

const vendorRoute = express.Router();

// Get all vendors
vendorRoute.get('/', async (req, res) => {
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

// Create a new vendor
vendorRoute.post('/', async (req, res) => {
    const { name, type, cif, cnp } = req.body;
    if (type === 'company' && !cif) return res.status(400).json({ message: 'CIF is required for companies' });
    if (type === 'individual' && !cnp) return res.status(400).json({ message: 'CNP is required for individuals' });

    try {
        const newVendor = new Vendor({ name, type, cif, cnp });
        await newVendor.save();
        res.status(201).json(newVendor);
    } catch (err) {
        res.status(400).json({ message: err.message });
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