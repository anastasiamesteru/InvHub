import express from 'express';
import Item from '../models/item.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const itemRoute = express.Router();

// Create a new item
itemRoute.post("/create",verifyToken, async (req, res) => {
    try {
        const item = new Item({
            ...req.body,
            userEmail: req.user.email,
        });
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Get all items
itemRoute.get("/getall",verifyToken, async (req, res) => {
    try {
        const items = await Item.find({ userEmail: req.user.email });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an item
itemRoute.put("/:id", verifyToken,async (req, res) => {
    try {
        const id = req.params.id.trim();

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

        const item = await Item.findOneAndUpdate(
            { _id: id, userEmail: req.user.email },
            req.body,
            { new: true, runValidators: true }
        );
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.status(200).json(item);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Delete an item
itemRoute.delete("/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id.trim();

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

        const item = await Item.findOneAndDelete({ _id: id, userEmail: req.user.email });        if (!item) return res.status(404).json({ error: "Item not found" });

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

export default itemRoute;
