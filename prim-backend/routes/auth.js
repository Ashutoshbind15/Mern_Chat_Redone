import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();
const secretKey = process.env.JWT_SECRET || "secret"; // Use a more secure secret in production

router.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).send("User created");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send("Invalid credentials");
    }
    // add roles here later
    const token = jwt.sign(
      { id: user._id, username: user.username },
      secretKey,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send({
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
