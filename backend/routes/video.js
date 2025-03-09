const express = require("express");
const router = express.Router();
const Course = require("../models/Course");


router.post("/:courseId/videos", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    course.videos.push(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.delete("/:courseId/videos/:videoId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    course.videos = course.videos.filter((video) => video._id.toString() !== req.params.videoId);
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
