import { AlertTriangle, BarChart3, IndianRupee, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Loading from "../components/Loading";
import StatCard from "../components/StatCard";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

const pieColors = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444"];

export default function Reports() {
  const [sales, setSales] = useState(null);
  const [inventory, setInventory] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    Promise.all([api.get("/reports/sales"), api.get("/reports/inventory")]).then(([salesReport, inventoryReport]) => {
      setSales(salesReport.data);
      setInventory(inventoryReport.data);
    });
  }, []);

  if (!sales || !inventory) return <Loading />;

  const monthlyData = sales.monthlyRevenue.map((item) => ({ name: `${item._id.month}/${item._id.year}`, revenue: item.revenue }));
  const statusData = sales.orderStatusSummary.map((item) => ({ name: item._id, value: item.count }));
  const chartColors = {
    axis: isDark ? "#CBD5E1" : "#64748B",
    grid: isDark ? "#334155" : "#E2E8F0",
    tooltipBg: isDark ? "#0F172A" : "#FFFFFF",
    tooltipText: isDark ? "#F8FAFC" : "#0F172A",
    tooltipBorder: isDark ? "#334155" : "#E2E8F0"
  };
  const tooltipStyle = {
    background: chartColors.tooltipBg,
    color: chartColors.tooltipText,
    border: `1px solid ${chartColors.tooltipBorder}`,
    borderRadius: 14,
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)"
  };

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <h2>Reports & Analytics</h2>
          <p>Sales, best sellers, stock warnings and order status performance.</p>
        </div>
      </div>
      <div className="stats-grid compact">
        <StatCard label="Total Sales" value={`Rs. ${sales.totalSales.toLocaleString()}`} icon={IndianRupee} tone="amber" />
        <StatCard label="Best Sellers" value={sales.bestSellingProducts.length} icon={Trophy} tone="green" />
        <StatCard label="Low Stock" value={inventory.lowStockProducts.length} icon={AlertTriangle} tone="red" />
        <StatCard label="Reports" value="Live" icon={BarChart3} />
      </div>
      <div className="grid-two">
        <section className="panel chart-panel">
          <div className="panel-heading rich-heading"><div><h2>Monthly Revenue</h2><p>Revenue generated from paid orders.</p></div></div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: chartColors.axis, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: chartColors.axis, fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: chartColors.tooltipText }} />
                <Bar dataKey="revenue" fill={isDark ? "#2DD4BF" : "#2563EB"} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel chart-panel">
          <div className="panel-heading rich-heading"><div><h2>Order Status Summary</h2><p>Distribution across fulfillment stages.</p></div></div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={96} label={{ fill: chartColors.axis, fontSize: 12 }}>
                  {statusData.map((entry, index) => <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: chartColors.tooltipText }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            {statusData.map((item, index) => (
              <span key={item.name}><i style={{ background: pieColors[index % pieColors.length] }} />{item.name}</span>
            ))}
          </div>
        </section>
      </div>
      <section className="panel data-panel">
        <div className="panel-heading rich-heading"><div><h2>Best-Selling Products</h2><p>Top products ranked by units sold.</p></div></div>
        <div className="table-responsive">
          <table className="table">
            <thead><tr><th>Product</th><th>Units Sold</th><th>Revenue</th></tr></thead>
            <tbody>
              {sales.bestSellingProducts.length === 0 ? (
                <tr><td colSpan="3"><div className="empty-state"><strong>No sales data yet</strong><span>Best-selling products will appear after orders are created.</span></div></td></tr>
              ) : sales.bestSellingProducts.map((product) => (
                <tr key={product._id}><td>{product.name}</td><td>{product.sold}</td><td>Rs. {product.revenue.toLocaleString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
