import { AlertTriangle, Boxes, PackageX, Save, Warehouse } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import StatCard from "../components/StatCard";
import api from "../services/api";

export default function Inventory() {
  const [report, setReport] = useState(null);
  const [stocks, setStocks] = useState({});

  const load = async () => {
    const { data } = await api.get("/reports/inventory");
    setReport(data);
    setStocks(Object.fromEntries(data.products.map((product) => [product._id, product.stock])));
  };

  useEffect(() => {
    load();
  }, []);

  const saveStock = async (product) => {
    await api.put(`/products/${product._id}`, { stock: Number(stocks[product._id]) });
    load();
  };

  if (!report) return <Loading />;

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <h2>Inventory</h2>
          <p>Track stock levels, update quantities and identify low-stock products.</p>
        </div>
      </div>
      <div className="stats-grid compact">
        <StatCard label="Total Items" value={report.products.length} icon={Boxes} />
        <StatCard label="Low Stock" value={report.lowStockProducts.length} icon={AlertTriangle} tone="red" />
        <StatCard label="Out of Stock" value={report.outOfStockProducts.length} icon={PackageX} tone="amber" />
        <StatCard label="Threshold" value={report.lowStockThreshold} icon={Warehouse} tone="green" />
      </div>
      <section className="panel data-panel">
        <div className="panel-heading rich-heading">
          <div>
            <h2>Stock Control</h2>
            <p>Update available quantities and monitor products below threshold.</p>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Product</th><th>Category</th><th>Current Stock</th><th>Update Stock</th><th></th></tr></thead>
            <tbody>
              {report.products.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <strong>No inventory records</strong>
                      <span>Add products to start tracking stock availability.</span>
                    </div>
                  </td>
                </tr>
              ) : report.products.map((product) => (
                <tr key={product._id}>
                  <td className="fw-semibold">{product.name}</td>
                  <td>{product.category?.name}</td>
                  <td className={product.stock < report.lowStockThreshold ? "text-danger fw-semibold" : ""}>{product.stock}</td>
                  <td><input type="number" className="form-control stock-input polished-input" min="0" value={stocks[product._id] ?? 0} onChange={(e) => setStocks({ ...stocks, [product._id]: e.target.value })} /></td>
                  <td className="text-end"><button className="btn btn-sm btn-gradient d-inline-flex gap-2 align-items-center" onClick={() => saveStock(product)}><Save size={15} />Save</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
