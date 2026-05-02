import { Edit, FolderTree, Layers, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

const emptyCategory = { name: "", description: "", status: "Active" };

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyCategory);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const load = () => api.get("/categories").then((res) => setCategories(res.data));

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (editingId) await api.put(`/categories/${editingId}`, form);
      else await api.post("/categories", form);
      setForm(emptyCategory);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const edit = (category) => {
    setEditingId(category._id);
    setForm({ name: category.name, description: category.description, status: category.status });
  };

  const remove = async (id) => {
    if (!confirm("Delete this category?")) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <h2>Categories</h2>
          <p>Create and organize product categories for the catalog.</p>
        </div>
      </div>
      <div className="stats-grid compact">
        <StatCard label="Total Categories" value={categories.length} icon={FolderTree} />
        <StatCard label="Active Categories" value={categories.filter((category) => category.status === "Active").length} icon={Layers} tone="green" />
      </div>
      <div className="grid-two category-layout">
        <form className="panel form-panel enhanced-form" onSubmit={submit}>
          <div className="panel-heading rich-heading">
            <div>
              <h2>{editingId ? "Edit Category" : "New Category"}</h2>
              <p>Keep category labels clear for faster product filtering.</p>
            </div>
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <label className="form-label">Category name<input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label className="form-label">Description<textarea className="form-control" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <label className="form-label">Status<select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select></label>
          <button className="btn btn-gradient d-flex gap-2 align-items-center justify-content-center"><Plus size={17} />{editingId ? "Update Category" : "Add Category"}</button>
        </form>
        <section className="panel data-panel">
          <div className="panel-heading rich-heading">
            <div>
              <h2>Category List</h2>
              <p>Maintain active and inactive store departments.</p>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>Name</th><th>Description</th><th>Status</th><th className="text-end">Actions</th></tr></thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state">
                        <strong>No categories yet</strong>
                        <span>Create your first category to start organizing products.</span>
                      </div>
                    </td>
                  </tr>
                ) : categories.map((category) => (
                  <tr key={category._id}>
                    <td className="fw-semibold">{category.name}</td>
                    <td>{category.description}</td>
                    <td><StatusBadge value={category.status} /></td>
                    <td className="text-end">
                      <button className="action-icon me-2" onClick={() => edit(category)} title="Edit"><Edit size={16} /></button>
                      <button className="action-icon danger" onClick={() => remove(category._id)} title="Delete"><Trash2 size={16} /></button>
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
