const express = require("express");
const Client = require("../models/client");

const router = express.Router();

//Create a new client
router.post("/", async (req, res) => {
    try {
        const client = new Client(req.body);
        await client.save();
        res.status(201).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Get all clients
router.get("/", async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Get a single client by ID
router.get("/:id", async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) return res.status(404).json({ error: "Client not found" });
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Update a client
router.put("/:id", async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!client) return res.status(404).json({ error: "Client not found" });
        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Delete a client
router.delete("/:id", async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) return res.status(404).json({ error: "Client not found" });
        res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
