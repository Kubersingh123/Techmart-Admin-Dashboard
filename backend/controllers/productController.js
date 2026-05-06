import Category from "../models/Category.js";
import Product from "../models/Product.js";

const buildProductQuery = ({ search, category, status }) => {
  const query = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;
  if (status) query.status = status;
  return query;
};

const fallbackProducts = [
  {
    name: "NovaBook Pro 14",
    categoryName: "Laptops",
    brand: "Nova",
    price: 74999,
    stock: 12,
    description: "Premium 14-inch business laptop with fast SSD storage and long battery life.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=900",
    status: "Active"
  },
  {
    name: "Pulse Wireless Earbuds",
    categoryName: "Audio",
    brand: "Pulse",
    price: 3499,
    stock: 35,
    description: "Compact wireless earbuds with clear audio, charging case and touch controls.",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=900",
    status: "Active"
  },
  {
    name: "TechMart Smart Watch",
    categoryName: "Wearables",
    brand: "TechMart",
    price: 5999,
    stock: 20,
    description: "Smart watch with fitness tracking, notifications and water-resistant design.",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=900",
    status: "Active"
  },
  {
    name: "SanDisk SSD PLUS 1TB",
    categoryName: "Storage",
    brand: "SanDisk",
    price: 6999,
    stock: 16,
    description: "1TB SATA SSD for faster boot times, app loading and file transfers.",
    image: "https://images.unsplash.com/photo-1597138804456-e7dca7f59d11?q=80&w=900",
    status: "Active"
  },
  {
    name: "WD 2TB External Hard Drive",
    categoryName: "Storage",
    brand: "Western Digital",
    price: 5799,
    stock: 22,
    description: "Portable 2TB external hard drive for backups, documents and media.",
    image: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?q=80&w=900",
    status: "Active"
  },
  {
    name: "Bluetooth Speaker",
    categoryName: "Audio",
    brand: "BoomBox",
    price: 2499,
    stock: 28,
    description: "Portable Bluetooth speaker with punchy bass and all-day battery backup.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=900",
    status: "Active"
  },
  {
    name: "Gaming Mouse",
    categoryName: "Accessories",
    brand: "HyperClick",
    price: 1499,
    stock: 40,
    description: "Ergonomic gaming mouse with adjustable DPI and RGB lighting.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=900",
    status: "Active"
  },
  {
    name: "USB-C Fast Charger",
    categoryName: "Accessories",
    brand: "VoltMax",
    price: 1199,
    stock: 50,
    description: "Compact USB-C fast charger for smartphones, tablets and accessories.",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=900",
    status: "Active"
  }
];

const fetchFakeStoreProducts = async () => {
  const response = await fetch("https://fakestoreapi.com/products?limit=10");
  if (!response.ok) {
    throw new Error(`Fake Store API responded with ${response.status}`);
  }
  const products = await response.json();
  return products.map((item) => ({
    name: item.title,
    categoryName: item.category || "Imported Electronics",
    brand: "TechMart Import",
    price: item.price,
    stock: Math.floor(Math.random() * 25) + 1,
    description: item.description,
    image: item.image,
    status: "Active"
  }));
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
  let imported = [];
  let source = "Fake Store API";

  try {
    imported = await fetchFakeStoreProducts();
    console.log(`[Import Products] Loaded ${imported.length} products from Fake Store API.`);
  } catch (error) {
    source = "local fallback";
    imported = fallbackProducts;
    console.error(`[Import Products] Fake Store API failed: ${error.message}`);
    console.log(`[Import Products] Using ${imported.length} fallback products.`);
  }

  const categoryCache = new Map();
  const savedProducts = [];
  const skippedProducts = [];

  for (const item of imported) {
    try {
      const categoryName = item.categoryName || "Imported Electronics";
      let category = categoryCache.get(categoryName);

      if (!category) {
        category = await Category.findOneAndUpdate(
          { name: categoryName },
          { name: categoryName, description: `Imported from ${source}`, status: "Active" },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        categoryCache.set(categoryName, category);
      }

      const exists = await Product.findOne({ name: item.name });
      if (exists) {
        skippedProducts.push(item.name);
        continue;
      }

      savedProducts.push(
        await Product.create({
          name: item.name,
          category: category._id,
          brand: item.brand,
          price: item.price,
          stock: item.stock,
          description: item.description,
          image: item.image,
          status: item.status || "Active"
        })
      );
    } catch (error) {
      console.error(`[Import Products] Failed to import "${item.name || "Unknown product"}": ${error.message}`);
    }
  }

  const products = await Product.find({ _id: { $in: savedProducts.map((p) => p._id) } }).populate("category", "name");
  console.log(
    `[Import Products] Completed via ${source}. Imported: ${products.length}. Skipped duplicates: ${skippedProducts.length}.`
  );

  res.status(201).json({
    message: `${products.length} products imported from ${source}. ${skippedProducts.length} duplicates skipped.`,
    source,
    importedCount: products.length,
    skippedCount: skippedProducts.length,
    products
  });
};
