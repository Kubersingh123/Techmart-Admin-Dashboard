import { CheckCircle, Eye, IndianRupee, Plus, ShoppingCart, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

const customerTemplate = { name: "", email: "", phone: "", address: "" };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ status: "", date: "" });
  const [customer, setCustomer] = useState(customerTemplate);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const loadOrders = async () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    const { data } = await api.get("/orders", { params });
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, [filters.status, filters.date]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data.filter((product) => product.status === "Active")));
  }, []);

  const createOrder = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await api.post("/orders", { customer, products: [{ product: selectedProduct, quantity: Number(quantity) }] });
      setCustomer(customerTemplate);
      setSelectedProduct("");
      setQuantity(1);
      setMessage("Order created and payment verification simulated.");
      loadOrders();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const nextStatus = (status) => ({ Pending: "Processing", Processing: "Shipped", Shipped: "Delivered" }[status]);

  const advanceStatus = async (order) => {
    const orderStatus = nextStatus(order.orderStatus);
    if (!orderStatus) return;
    await api.put(`/orders/${order._id}/status`, { orderStatus });
    loadOrders();
  };

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <h2>Orders</h2>
          <p>View customer orders, simulate payments and move orders through fulfillment.</p>
        </div>
      </div>
      <div className="stats-grid compact">
        <StatCard label="Total Orders" value={orders.length} icon={ShoppingCart} />
        <StatCard label="Pending" value={orders.filter((order) => order.orderStatus === "Pending").length} icon={Timer} tone="orange" />
        <StatCard label="Delivered" value={orders.filter((order) => order.orderStatus === "Delivered").length} icon={CheckCircle} tone="green" />
        <StatCard label="Revenue" value={`Rs. ${orders.filter((order) => order.paymentStatus === "Paid").reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}`} icon={IndianRupee} tone="amber" />
      </div>
      {message && <div className="alert alert-info py-2">{message}</div>}
      <div className="grid-two orders-layout">
        <form className="panel form-panel enhanced-form" onSubmit={createOrder}>
          <div className="panel-heading rich-heading">
            <div>
              <h2>Create Order</h2>
              <p>Stock is checked before a new order is saved.</p>
            </div>
          </div>
          <label className="form-label">Customer name<input className="form-control" placeholder="Customer name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} required /></label>
          <label className="form-label">Email<input type="email" className="form-control" placeholder="Email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} required /></label>
          <label className="form-label">Phone<input className="form-control" placeholder="Phone" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} required /></label>
          <label className="form-label">Address<textarea className="form-control" placeholder="Address" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} required /></label>
          <label className="form-label">Product<select className="form-select" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
            <option value="">Select product</option>
            {products.map((product) => <option key={product._id} value={product._id}>{product.name} - Stock {product.stock}</option>)}
          </select></label>
          <label className="form-label">Quantity<input type="number" className="form-control" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required /></label>
          <button className="btn btn-gradient d-flex gap-2 align-items-center justify-content-center"><Plus size={17} />Create Order</button>
        </form>
        <section className="panel data-panel">
          <div className="panel-heading rich-heading">
            <div>
              <h2>Order Queue</h2>
              <p>Filter orders and advance fulfillment status in one click.</p>
            </div>
          </div>
          <div className="filters filter-card mb-3">
            <select className="form-select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All statuses</option>
              <option>Pending</option><option>Processing</option><option>Shipped</option><option>Delivered</option>
            </select>
            <input type="date" className="form-control" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
          </div>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Payment</th><th>Status</th><th className="text-end">Action</th></tr></thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <strong>No orders found</strong>
                        <span>Create a new order or clear filters to view the queue.</span>
                      </div>
                    </td>
                  </tr>
                ) : orders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6).toUpperCase()}</td>
                    <td>{order.customer?.name}<br /><small>{order.customer?.email}</small></td>
                    <td>Rs. {order.totalAmount.toLocaleString()}</td>
                    <td><StatusBadge value={order.paymentStatus} /></td>
                    <td><StatusBadge value={order.orderStatus} /></td>
                    <td className="text-end">
                      {nextStatus(order.orderStatus) && <button className="btn btn-sm btn-soft me-2" onClick={() => advanceStatus(order)}>{nextStatus(order.orderStatus)}</button>}
                      <Link className="action-icon" to={`/orders/${order._id}`} title="View"><Eye size={16} /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
