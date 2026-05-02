import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const emptyProduct = { name: "", category: "", brand: "", price: "", stock: "", description: "", image: "", status: "Active" };

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(emptyProduct);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.filter((category) => category.status === "Active")));
    if (id) {
      api.get(`/products/${id}`).then((res) => {
        setProduct({ ...res.data, category: res.data.category?._id || res.data.category });
      });
    }
  }, [id]);

  const update = (field, value) => setProduct((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const payload = { ...product, price: Number(product.price), stock: Number(product.stock) };
      if (id) await api.put(`/products/${id}`, payload);
      else await api.post("/products", payload);
      navigate("/products");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <h2>{id ? "Edit Product" : "Add Product"}</h2>
          <p>Fill product details carefully because inventory and orders depend on this data.</p>
        </div>
        <Link className="btn btn-soft" to="/products">Back</Link>
      </div>
      <form className="panel form-grid form-panel enhanced-form" onSubmit={submit}>
        {error && <div className="alert alert-danger grid-full">{error}</div>}
        <label className="form-label">Product name<input className="form-control" value={product.name} onChange={(e) => update("name", e.target.value)} required /></label>
        <label className="form-label">Category<select className="form-select" value={product.category} onChange={(e) => update("category", e.target.value)} required><option value="">Select category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select></label>
        <label className="form-label">Brand<input className="form-control" value={product.brand} onChange={(e) => update("brand", e.target.value)} required /></label>
        <label className="form-label">Price<input type="number" className="form-control" min="0" value={product.price} onChange={(e) => update("price", e.target.value)} required /></label>
        <label className="form-label">Stock quantity<input type="number" className="form-control" min="0" value={product.stock} onChange={(e) => update("stock", e.target.value)} required /></label>
        <label className="form-label">Status<select className="form-select" value={product.status} onChange={(e) => update("status", e.target.value)}><option>Active</option><option>Inactive</option></select></label>
        <label className="form-label grid-full">Product image URL<input className="form-control" value={product.image} onChange={(e) => update("image", e.target.value)} /></label>
        <label className="form-label grid-full">Description<textarea className="form-control" rows="4" value={product.description} onChange={(e) => update("description", e.target.value)} /></label>
        <button className="btn btn-primary d-flex gap-2 align-items-center justify-content-center"><Save size={17} />Save Product</button>
      </form>
    </div>
  );
}
