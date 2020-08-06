const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();

const User = require("../models/User");

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ erorr: "Invalid Credentials" });
    }

    const payload = {
      user: {
        _id: user._id,
      },
    };

    const token = jwt.sign(payload, config.get("JWT_SECRET"), {
      expiresIn: "1hr",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPsw = await bcrypt.hash(password, 12);

    user = new User({
      username,
      email,
      password: hashedPsw,
    });

    const newUser = await user.save();

    const payload = {
      user: {
        _id: newUser._id,
      },
    };

    const token = jwt.sign(payload, config.get("JWT_SECRET"), {
      expiresIn: "1hr",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
