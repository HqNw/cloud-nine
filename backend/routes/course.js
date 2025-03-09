const express = require("express");
const router = express.Router();
const Course = require("../models/Course");


router.post("/", async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher").populate("students.studentId");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "delete course"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
