const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const createRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    res.status(201).json({
      message: "Registration successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = createAccessToken(decoded.id);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, refresh, getMe };
