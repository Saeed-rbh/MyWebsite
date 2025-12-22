const express = require('express');
const router = express.Router();
const CVSection = require('../models/CVSection');

// GET all sections sorted by order (SeqId logic handles sorting on frontend, but we can sort by id or just return all)
router.get('/', async (req, res) => {
    try {
        const sections = await CVSection.findAll();
        res.json(sections);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE a section
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await CVSection.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedSection = await CVSection.findOne({ where: { id: id } });
            res.status(200).json(updatedSection);
        } else {
            res.status(404).json({ message: "Section not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
