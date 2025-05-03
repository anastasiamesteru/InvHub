import express from 'express';
import Vendor from '../models/vendor.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const vendorRoute = express.Router();

//Create a new vendor
vendorRoute.post("/create",verifyToken,  async (req, res) => {
    try {
        const vendor = new Vendor({
            ...req.body,
            userEmail: req.user.email,
        });
        await vendor.save();
        res.status(201).json(vendor);
    } catch (error) {
        console.error('Error:', error);

        return res.status(400).json({ message: error.message || 'Something went wrong while creating the vendor.' });
    }
});


// Get all vendors
vendorRoute.get('/getall', verifyToken, async (req, res) => {
    try {
        const vendors = await Vendor.find({ userEmail: req.user.email });
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Update a vendor
vendorRoute.put("/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id.trim();

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

        const vendor = await Vendor.findOneAndUpdate(
            { _id: id, userEmail: req.user.email },
            req.body,
            { new: true, runValidators: true }
        );
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        res.status(200).json(vendor);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});



vendorRoute.delete("/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id.trim();

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

        const vendor = await Vendor.findOneAndDelete({ _id: id, userEmail: req.user.email });
        if (!vendor) return res.status(404).json({ error: "Vendor not found" });

        res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

export default vendorRoute;