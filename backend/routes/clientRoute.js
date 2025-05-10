import express from 'express';
import Client from '../models/client.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const clientRoute = express.Router();

//Create a new client
clientRoute.post("/create",verifyToken,  async (req, res) => {
    try {
        const client = new Client({
            ...req.body,
            userEmail: req.user.email,
        });
        await client.save();
        res.status(201).json(client);
    } catch (error) {
        console.error('Error:', error);

        return res.status(400).json({ message: error.message || 'Something went wrong while creating the client.' });
    }
});

//Get all clients
clientRoute.get("/getall", verifyToken, async (req, res) => {
    try {
        const clients = await Client.find({ userEmail: req.user.email });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get one client 
clientRoute.get("/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id.trim();

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

        const client = await Client.findOne({ _id: id, userEmail: req.user.email });

        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }

        res.status(200).json(client);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Update a client
clientRoute.put("/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id.trim();

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

        const client = await Client.findOneAndUpdate(
            { _id: id, userEmail: req.user.email },
            req.body,
            { new: true, runValidators: true }
        );
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }

        res.status(200).json(client);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

clientRoute.delete("/:id", verifyToken, async (req, res) => {
    try {
        const id = req.params.id.trim();

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

        const client = await Client.findOneAndDelete({ _id: id, userEmail: req.user.email });
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }

        res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});
export default clientRoute;
