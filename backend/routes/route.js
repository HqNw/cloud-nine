const express= require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");





router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, "secret");

    //{ expiresIn: "1h" })  write in token depends on your security needs and user experience
    res.json({ token });
  });


  