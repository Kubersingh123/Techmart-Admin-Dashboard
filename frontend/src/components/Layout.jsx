import {
  BarChart3,
  Boxes,
  ClipboardList,
  FolderTree,
  Gauge,
  LogOut,
  Moon,
  Package,
  Settings,
  Sun,
  Users
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/products", label: "Products", icon: Package },
  { to: "/categories", label: "Categories", icon: FolderTree },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/orders", label: "Orders", icon: ClipboardList },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings }
];

export default function Layout() {
  const { admin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const ThemeIcon = isDark ? Sun : Moon;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img className="brand-logo" src="/assets/techmart-logo.png" alt="TechMart Admin Dashboard" />
          <div>
            <strong>TechMart</strong>
            <small>Admin System</small>
          </div>
        </div>
        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.to === "/"}>
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div className="topbar-copy">
            <p className="eyebrow mb-0">E-Commerce Admin & Order Management</p>
            <h1>Welcome back, Admin 👋</h1>
            <span>Here is what is happening with your store today.</span>
          </div>
          <div className="topbar-actions">
            <button className="theme-toggle" onClick={toggleTheme} title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
              <ThemeIcon size={18} />
            </button>
            <div className="topbar-user">
              <div className="avatar-circle">TA</div>
              <div className="text-end">
                <strong>{admin?.name}</strong>
                <small>{admin?.role}</small>
              </div>
              <button className="logout-btn" onClick={logout} title="Logout">
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>
        <section className="content-area">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
