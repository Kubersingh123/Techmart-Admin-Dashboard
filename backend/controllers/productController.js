import Category from "../models/Category.js";
import Product from "../models/Product.js";

const buildProductQuery = ({ search, category, status }) => {
  const query = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;
  if (status) query.status = status;
  return query;
};

export const getProducts = async (req, res) => {
  const products = await Product.find(buildProductQuery(req.query))
    .populate("category", "name status")
    .sort({ createdAt: -1 });
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category", "name status");
  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json(product);
};

export const createProduct = async (req, res) => {
  const { name, category, brand, price, stock, description, image, status } = req.body;
  if (!name || !category || !brand || price === undefined || stock === undefined) {
    return res.status(400).json({ message: "Name, category, brand, price and stock are required." });
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) return res.status(400).json({ message: "Selected category does not exist." });

  const product = await Product.create({ name, category, brand, price, stock, description, image, status });
  res.status(201).json(await product.populate("category", "name status"));
};

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });

  const fields = ["name", "category", "brand", "price", "stock", "description", "image", "status"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });

  if (product.category) {
    const categoryExists = await Category.findById(product.category);
    if (!categoryExists) return res.status(400).json({ message: "Selected category does not exist." });
  }

  await product.save();
  res.json(await product.populate("category", "name status"));
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found." });

  await product.deleteOne();
  res.json({ message: "Product deleted successfully." });
};

export const importProducts = async (req, res) => {
  const response = await fetch("https://fakestoreapi.com/products?limit=10");
  if (!response.ok) return res.status(502).json({ message: "Unable to fetch products from Fake Store API." });

  const imported = await response.json();
  const categoryCache = new Map();
  const savedProducts = [];

  for (const item of imported) {
    const categoryName = item.category || "Imported Electronics";
    let category = categoryCache.get(categoryName);

    if (!category) {
      category = await Category.findOneAndUpdate(
        { name: categoryName },
        { name: categoryName, description: "Imported from Fake Store API", status: "Active" },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      categoryCache.set(categoryName, category);
    }

    const exists = await Product.findOne({ name: item.title });
    if (exists) continue;

    savedProducts.push(
      await Product.create({
        name: item.title,
        category: category._id,
        brand: "TechMart Import",
        price: item.price,
        stock: Math.floor(Math.random() * 25) + 1,
        description: item.description,
        image: item.image,
        status: "Active"
      })
    );
  }

  const products = await Product.find({ _id: { $in: savedProducts.map((p) => p._id) } }).populate("category", "name");
  res.status(201).json({ message: `${products.length} products imported.`, products });
};
