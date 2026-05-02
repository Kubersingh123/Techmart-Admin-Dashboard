import { AlertTriangle, Download, Edit, Package, PackageCheck, PackageX, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    const { data } = await api.get("/products", { params });
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters.category, filters.status]);

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const importProducts = async () => {
    setMessage("Importing products...");
    try {
      const { data } = await api.post("/products/import");
      setMessage(data.message);
      loadProducts();
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <Loading />;

  const productStats = {
    total: products.length,
    active: products.filter((product) => product.status === "Active").length,
    inactive: products.filter((product) => product.status === "Inactive").length,
    lowStock: products.filter((product) => product.stock < 5).length
  };

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <h2>Products</h2>
          <p>Manage product catalog, prices, images and active status.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-soft d-flex gap-2 align-items-center" onClick={importProducts}><Download size={17} />Import Products</button>
          <Link to="/products/new" className="btn btn-gradient d-flex gap-2 align-items-center"><Plus size={17} />Add Product</Link>
        </div>
      </div>
      <div className="stats-grid compact">
        <StatCard label="Total Products" value={productStats.total} icon={Package} />
        <StatCard label="Active Products" value={productStats.active} icon={PackageCheck} tone="green" />
        <StatCard label="Inactive Products" value={productStats.inactive} icon={PackageX} tone="amber" />
        <StatCard label="Low Stock" value={productStats.lowStock} icon={AlertTriangle} tone="red" />
      </div>
      {message && <div className="alert alert-info py-2">{message}</div>}
      <section className="panel data-panel">
        <div className="panel-heading rich-heading">
          <div>
            <h2>Product Catalog</h2>
            <p>Search, filter, import, edit and remove store products.</p>
          </div>
        </div>
        <div className="filters filter-card">
          <div className="input-group">
            <span className="input-group-text"><Search size={17} /></span>
            <input className="form-control" placeholder="Search products" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} onKeyDown={(e) => e.key === "Enter" && loadProducts()} />
          </div>
          <select className="form-select" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
          </select>
          <select className="form-select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <strong>No products found</strong>
                      <span>Add a product or import products from the public catalog.</span>
                    </div>
                  </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="product-cell">
                      <img src={product.image || "https://placehold.co/80x80?text=TM"} alt={product.name} />
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>{product.category?.name}</td>
                  <td>{product.brand}</td>
                  <td>Rs. {product.price.toLocaleString()}</td>
                  <td className={product.stock < 5 ? "text-danger fw-semibold" : ""}>{product.stock}</td>
                  <td><StatusBadge value={product.status} /></td>
                  <td className="text-end">
                    <Link className="action-icon me-2" to={`/products/${product._id}/edit`} title="Edit"><Edit size={16} /></Link>
                    <button className="action-icon danger" onClick={() => deleteProduct(product._id)} title="Delete"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
