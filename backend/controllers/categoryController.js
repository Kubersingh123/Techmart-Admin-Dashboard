import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
};

export const createCategory = async (req, res) => {
  const { name, description, status } = req.body;
  if (!name) return res.status(400).json({ message: "Category name is required." });

  const exists = await Category.findOne({ name: new RegExp(`^${name}$`, "i") });
  if (exists) return res.status(409).json({ message: "Duplicate category name." });

  const category = await Category.create({ name, description, status });
  res.status(201).json(category);
};

export const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found." });

  const { name, description, status } = req.body;
  if (name && name.toLowerCase() !== category.name.toLowerCase()) {
    const exists = await Category.findOne({ name: new RegExp(`^${name}$`, "i") });
    if (exists) return res.status(409).json({ message: "Duplicate category name." });
  }

  category.name = name ?? category.name;
  category.description = description ?? category.description;
  category.status = status ?? category.status;
  await category.save();
  res.json(category);
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found." });

  await category.deleteOne();
  res.json({ message: "Category deleted successfully." });
};
