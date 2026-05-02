import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

const buildAdminResponse = (admin) => ({
  _id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role
});

export const registerAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required." });
  }

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res.status(409).json({ message: "Admin with this email already exists." });
  }

  const admin = await Admin.create({ name, email, password, role });
  res.status(201).json({
    admin: buildAdminResponse(admin),
    token: signToken(admin._id)
  });
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid login credentials." });
  }

  res.json({
    admin: buildAdminResponse(admin),
    token: signToken(admin._id)
  });
};
