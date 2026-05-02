import { Bell, KeyRound, Mail, Save, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { admin } = useAuth();
  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <h2>Settings & Profile</h2>
          <p>Basic admin profile information for the logged-in account.</p>
        </div>
      </div>
      <section className="panel settings-hero">
        <img className="profile-logo" src="/assets/techmart-logo.png" alt="TechMart Admin Dashboard" />
        <div>
          <span className="settings-kicker">Admin Workspace</span>
          <h3>{admin?.name}</h3>
          <p>{admin?.email}</p>
          <span className="status-badge status-primary">{admin?.role}</span>
        </div>
      </section>
      <div className="grid-two settings-grid">
        <section className="panel form-panel enhanced-form">
          <div className="panel-heading rich-heading">
            <div>
              <h2>Profile Information</h2>
              <p>Local profile preview for the signed-in admin account.</p>
            </div>
          </div>
          <label className="form-label">Full name<input className="form-control" value={admin?.name || ""} readOnly /></label>
          <label className="form-label">Email address<input className="form-control" value={admin?.email || ""} readOnly /></label>
          <label className="form-label">Role<input className="form-control" value={admin?.role || "admin"} readOnly /></label>
          <button className="btn btn-soft d-flex gap-2 align-items-center justify-content-center" type="button"><Save size={17} />Profile is synced from login</button>
        </section>
        <section className="panel settings-list">
          <div className="panel-heading rich-heading">
            <div>
              <h2>Account Settings</h2>
              <p>Security and notification preferences for the admin panel.</p>
            </div>
          </div>
          <div className="settings-row"><UserRound size={19} /><div><strong>Account Type</strong><span>Administrator access to dashboard modules</span></div></div>
          <div className="settings-row"><Mail size={19} /><div><strong>Email Notifications</strong><span>Order and stock alerts enabled for review</span></div></div>
          <div className="settings-row"><Bell size={19} /><div><strong>Inventory Alerts</strong><span>Low stock alerts use the backend threshold</span></div></div>
          <div className="settings-row"><ShieldCheck size={19} /><div><strong>JWT Session</strong><span>Protected routes require a valid login token</span></div></div>
        </section>
      </div>
      <section className="panel settings-security">
        <div className="panel-heading rich-heading">
          <div>
            <h2>Password & Security</h2>
            <p>Password updates can be connected to a dedicated backend endpoint later.</p>
          </div>
        </div>
        <div className="security-grid">
          <div className="security-card"><KeyRound size={20} /><strong>Password protected</strong><span>Admin passwords are hashed on the backend.</span></div>
          <div className="security-card"><ShieldCheck size={20} /><strong>Secure routes</strong><span>Dashboard pages are protected by JWT authentication.</span></div>
        </div>
      </section>
    </div>
  );
}
