import { AlertTriangle, CheckCircle, IndianRupee, Package, ShoppingCart, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Loading from "../components/Loading";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [sales, setSales] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    Promise.all([api.get("/reports/dashboard"), api.get("/reports/sales")]).then(([dashboard, salesReport]) => {
      setData(dashboard.data);
      setSales(salesReport.data);
    });
  }, []);

  if (!data || !sales) return <Loading />;

  const chartData = sales.monthlyRevenue.map((item) => ({
    month: `${item._id.month}/${item._id.year}`,
    revenue: item.revenue
  }));
  const chartColors = {
    axis: isDark ? "#CBD5E1" : "#64748B",
    grid: isDark ? "#334155" : "#E2E8F0",
    tooltipBg: isDark ? "#0F172A" : "#FFFFFF",
    tooltipText: isDark ? "#F8FAFC" : "#0F172A",
    tooltipBorder: isDark ? "#334155" : "#E2E8F0",
    bar: isDark ? "#2DD4BF" : "#14B8A6"
  };

  return (
    <div className="page-stack">
      <div className="stats-grid">
        <StatCard label="Total Products" value={data.totalProducts} icon={Package} />
        <StatCard label="Total Orders" value={data.totalOrders} icon={ShoppingCart} tone="green" />
        <StatCard label="Total Revenue" value={`Rs. ${data.totalRevenue.toLocaleString()}`} icon={IndianRupee} tone="amber" />
        <StatCard label="Pending Orders" value={data.pendingOrders} icon={Timer} tone="orange" />
        <StatCard label="Delivered Orders" value={data.deliveredOrders} icon={CheckCircle} tone="green" />
        <StatCard label="Low Stock" value={data.lowStockCount} icon={AlertTriangle} tone="red" />
      </div>
      <div className="grid-two">
        <section className="panel chart-panel">
          <div className="panel-heading rich-heading">
            <div>
              <h2>Monthly Revenue</h2>
              <p>Paid order revenue grouped month by month.</p>
            </div>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: chartColors.axis, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: chartColors.axis, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: chartColors.tooltipBg,
                    color: chartColors.tooltipText,
                    border: `1px solid ${chartColors.tooltipBorder}`,
                    borderRadius: 14,
                    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)"
                  }}
                  labelStyle={{ color: chartColors.tooltipText }}
                />
                <Bar dataKey="revenue" fill={chartColors.bar} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel orders-panel">
          <div className="panel-heading rich-heading">
            <div>
              <h2>Recent Orders</h2>
              <p>Latest customer activity and fulfillment status.</p>
            </div>
            <Link className="view-all-btn" to="/orders">View All</Link>
          </div>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state">
                        <strong>No recent orders</strong>
                        <span>New orders will appear here once customers start buying.</span>
                      </div>
                    </td>
                  </tr>
                ) : data.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <strong>{order.customer?.name}</strong>
                      <small>#{order._id.slice(-6).toUpperCase()}</small>
                    </td>
                    <td className="amount-cell">Rs. {order.totalAmount.toLocaleString()}</td>
                    <td><StatusBadge value={order.paymentStatus} /></td>
                    <td><StatusBadge value={order.orderStatus} /></td>
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
