import express from 'express';
import Client from '../models/client.js';

const clientRoute = express.Router();

//Create a new client
clientRoute.post("/create", async (req, res) => {
    try {
        const client = new Client(req.body);

        // Log the client data for debugging purposes
        console.log('Client Data:', req.body);

        // Save the client to the database
        await client.save();
        res.status(201).json(client);
    } catch (error) {
        console.error('Error:', error); // Log the error for debugging

        // Return more detailed error message
        return res.status(400).json({ message: error.message || 'Something went wrong while creating the client.' });
    }
});

//Get all clients
clientRoute.get("/getall", async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Get a single client by ID
clientRoute.get("/:id", async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ error: "Client not found" });
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Update a client
clientRoute.put("/:id", async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!client) return res.status(404).json({ error: "Client not found" });
        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Delete a client
clientRoute.delete("/:id", async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) return res.status(404).json({ error: "Client not found" });
        res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default clientRoute;
