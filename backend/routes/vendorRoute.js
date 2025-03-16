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
vendorRoute.get('/getall', async (req, res) => {
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
vendorRoute.put("/:id", async (req, res) => {
    try {
        const id = req.params.id.trim();  

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

        const vendor = await Vendor.findByIdAndUpdate(id, req.body, {
            new: true, 
            runValidators: true, 
        });

        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        res.status(200).json(vendor);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});



vendorRoute.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id.trim(); 

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

        const vendor = await Vendor.findByIdAndDelete(id);
        if (!vendor) return res.status(404).json({ error: "Vendor not found" });

        res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

export default vendorRoute;