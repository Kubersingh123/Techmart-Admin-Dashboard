import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const getDashboardReport = async (req, res) => {
  const lowStockThreshold = Number(process.env.LOW_STOCK_THRESHOLD || 5);
  const [totalProducts, orders, lowStockProducts] = await Promise.all([
    Product.countDocuments(),
    Order.find(),
    Product.find({ stock: { $lt: lowStockThreshold } }).populate("category", "name")
  ]);

  const totalOrders = orders.length;
  const totalRevenue = orders.filter((o) => o.paymentStatus === "Paid").reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === "Delivered").length;

  const recentOrders = await Order.find().populate("customer").sort({ orderDate: -1 }).limit(6);

  res.json({
    totalProducts,
    totalOrders,
    totalRevenue,
    pendingOrders,
    deliveredOrders,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    recentOrders
  });
};

export const getSalesReport = async (req, res) => {
  const monthlyRevenue = await Order.aggregate([
    { $match: { paymentStatus: "Paid" } },
    {
      $group: {
        _id: { year: { $year: "$orderDate" }, month: { $month: "$orderDate" } },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  const bestSellingProducts = await Order.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.product",
        name: { $first: "$products.name" },
        sold: { $sum: "$products.quantity" },
        revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }
      }
    },
    { $sort: { sold: -1 } },
    { $limit: 5 }
  ]);

  const orderStatusSummary = await Order.aggregate([
    { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
  ]);

  const totalSales = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  res.json({ totalSales, monthlyRevenue, bestSellingProducts, orderStatusSummary });
};

export const getInventoryReport = async (req, res) => {
  const lowStockThreshold = Number(process.env.LOW_STOCK_THRESHOLD || 5);
  const products = await Product.find().populate("category", "name").sort({ stock: 1 });
  const lowStockProducts = products.filter((product) => product.stock < lowStockThreshold);
  const outOfStockProducts = products.filter((product) => product.stock === 0);

  res.json({ products, lowStockProducts, outOfStockProducts, lowStockThreshold });
};
