const express = require("express");
const router = express.Router();
const Genre = require("./genre.model");

router.post("/genres", async (req, res) => {
  try {
    const { name } = req.body;
    const newGenre = new Genre({ name });
    await newGenre.save();
    res.status(201).json(newGenre);
  } catch (error) {
    res.status(500).json({ error: "Error adding genre" });
  }
});

router.get("/genres", async (req, res) => {
  try {
    const genres = await Genre.find();
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ error: "Error fetching genres" });
  }
});

router.get("/genres/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).json({ error: "Genre not found" });
    res.status(200).json(genre);
  } catch (error) {
    res.status(500).json({ error: "Error fetching genre" });
  }
});

router.put("/genres/:id", async (req, res) => {
  try {
    const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedGenre) return res.status(404).json({ error: "Genre not found" });
    res.status(200).json(updatedGenre);
  } catch (error) {
    res.status(500).json({ error: "Error updating genre" });
  }
});

router.delete("/genres/:id", async (req, res) => {
  try {
    const deletedGenre = await Genre.findByIdAndDelete(req.params.id);
    if (!deletedGenre) return res.status(404).json({ error: "Genre not found" });
    res.status(200).json({ message: "Genre deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting genre" });
  }
});

module.exports = router;