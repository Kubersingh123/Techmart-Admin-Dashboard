import Customer from "../models/Customer.js";
import Order from "../models/Order.js";

export const getCustomers = async (req, res) => {
  const customers = await Customer.find().sort({ createdAt: -1 });
  res.json(customers);
};

export const getCustomerById = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ message: "Customer not found." });

  const orders = await Order.find({ customer: customer._id }).sort({ orderDate: -1 });
  res.json({ customer, orders });
};
