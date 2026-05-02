import { Eye, EyeOff, Lock, LogIn, Mail, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, register, isAuthenticated } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "TechMart Admin", email: "admin@techmart.com", password: "admin123" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isRegister) await register(form);
      else await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-screen">
      <div className="login-backdrop" />
      <section className="login-hero-panel" aria-hidden="true">
        <div className="login-feature-card">
          <ShieldCheck size={28} />
          <span>Secure admin access for TechMart management.</span>
        </div>
        <h2>Control your store operations from one command center.</h2>
        <p>Track products, inventory, orders, customers, payments and performance with a clean admin workspace.</p>
      </section>
      <form className="login-card" onSubmit={submit}>
        <div className="login-brand">
          <img className="login-logo" src="/assets/techmart-logo.png" alt="TechMart Admin Dashboard" />
          <span>Welcome back 👋</span>
          <h1>{isRegister ? "Create Admin Account" : "TechMart Admin"}</h1>
          <p>Manage products, inventory, orders, and reports from one dashboard.</p>
        </div>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        {isRegister && (
          <label className="login-field">
            <span>Name</span>
            <div className="login-input-wrap">
              <User size={18} />
              <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
          </label>
        )}
        <label className="login-field">
          <span>Email</span>
          <div className="login-input-wrap">
            <Mail size={18} />
            <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
        </label>
        <label className="login-field">
          <span>Password</span>
          <div className="login-input-wrap">
            <Lock size={18} />
            <input type={showPassword ? "text" : "password"} className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} title={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
        <button className="login-submit" disabled={loading}>
          <LogIn size={18} />
          {loading ? "Please wait..." : isRegister ? "Register Admin" : "Login"}
        </button>
        <button type="button" className="login-switch" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Already have an account? Login" : "Need first admin? Register"}
        </button>
      </form>
    </main>
  );
}
