import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Admin from "./models/Admin.js";
import Category from "./models/Category.js";
import Customer from "./models/Customer.js";
import Order from "./models/Order.js";
import Product from "./models/Product.js";

dotenv.config();
await connectDB();

await Promise.all([Admin.deleteMany(), Category.deleteMany(), Customer.deleteMany(), Order.deleteMany(), Product.deleteMany()]);

const admin = await Admin.create({
  name: "TechMart Admin",
  email: "admin@techmart.com",
  password: "admin123",
  role: "admin"
});

const categories = await Category.insertMany([
  { name: "Smartphones", description: "Mobile phones and accessories", status: "Active" },
  { name: "Laptops", description: "Work, gaming and student laptops", status: "Active" },
  { name: "Audio", description: "Headphones, earbuds and speakers", status: "Active" }
]);

const products = await Product.insertMany([
  {
    name: "Apex X1 Smartphone",
    category: categories[0]._id,
    brand: "Apex",
    price: 29999,
    stock: 18,
    description: "AMOLED display, 128GB storage and fast charging.",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800",
    status: "Active"
  },
  {
    name: "NovaBook Pro 14",
    category: categories[1]._id,
    brand: "Nova",
    price: 74999,
    stock: 4,
    description: "Thin professional laptop with 16GB RAM and SSD storage.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800",
    status: "Active"
  },
  {
    name: "Pulse Wireless Earbuds",
    category: categories[2]._id,
    brand: "Pulse",
    price: 3499,
    stock: 35,
    description: "Noise isolation, compact case and long battery life.",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=800",
    status: "Active"
  }
]);

const customer = await Customer.create({
  name: "Rahul Sharma",
  email: "rahul@example.com",
  phone: "9876543210",
  address: "MG Road, Bengaluru, Karnataka"
});

await Order.create({
  customer: customer._id,
  products: [{ product: products[2]._id, name: products[2].name, price: products[2].price, quantity: 2, image: products[2].image }],
  totalAmount: products[2].price * 2,
  paymentStatus: "Paid",
  orderStatus: "Processing"
});

console.log(`Seed complete. Login: ${admin.email} / admin123`);
process.exit(0);
