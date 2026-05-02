import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const allowedTransitions = {
  Pending: ["Processing"],
  Processing: ["Shipped"],
  Shipped: ["Delivered"],
  Delivered: []
};

const simulatePayment = () => (Math.random() > 0.15 ? "Paid" : "Failed");

export const getOrders = async (req, res) => {
  const { status, date } = req.query;
  const query = {};
  if (status) query.orderStatus = status;
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    query.orderDate = { $gte: start, $lt: end };
  }

  const orders = await Order.find(query)
    .populate("customer")
    .populate("products.product", "name brand stock")
    .sort({ orderDate: -1 });
  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("customer").populate("products.product");
  if (!order) return res.status(404).json({ message: "Order not found." });
  res.json(order);
};

export const createOrder = async (req, res) => {
  const { customer, products } = req.body;
  if (!customer || !products?.length) {
    return res.status(400).json({ message: "Customer details and products are required." });
  }

  const customerDoc = await Customer.findOneAndUpdate(
    { email: customer.email },
    customer,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const orderProducts = [];
  let totalAmount = 0;

  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
    if (product.status !== "Active") return res.status(400).json({ message: `${product.name} is inactive.` });
    if (product.stock < item.quantity) return res.status(400).json({ message: `${product.name} is out of stock.` });

    product.stock -= item.quantity;
    await product.save();

    orderProducts.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image
    });
    totalAmount += product.price * item.quantity;
  }

  const paymentStatus = simulatePayment();
  const order = await Order.create({
    customer: customerDoc._id,
    products: orderProducts,
    totalAmount,
    paymentStatus,
    orderStatus: paymentStatus === "Paid" ? "Pending" : "Pending"
  });

  res.status(201).json(await order.populate("customer"));
};

export const updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found." });

  const validNextStatuses = allowedTransitions[order.orderStatus] || [];
  if (!validNextStatuses.includes(orderStatus)) {
    return res.status(400).json({
      message: `Invalid order status update. ${order.orderStatus} can move to: ${validNextStatuses.join(", ") || "no further status"}.`
    });
  }

  order.orderStatus = orderStatus;
  await order.save();
  res.json(await order.populate("customer"));
};

export const updatePaymentStatus = async (req, res) => {
  const { paymentStatus } = req.body;
  const validStatuses = ["Pending", "Paid", "Failed", "Refunded"];
  if (!validStatuses.includes(paymentStatus)) {
    return res.status(400).json({ message: "Invalid payment status." });
  }

  const order = await Order.findByIdAndUpdate(req.params.id, { paymentStatus }, { new: true }).populate("customer");
  if (!order) return res.status(404).json({ message: "Order not found." });
  res.json(order);
};
