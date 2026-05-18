import { useState } from "react";
import "../styles/admin-management.css";

/**
 * Member 5 (Part 1) — Admin Management Component
 * Tabs: Dashboard | Admin List | Add Admin
 */

type Permissions = "FULL" | "MODERATOR" | "VIEWER";

interface Admin {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  permissions: Permissions;
}

const seed: Admin[] = [
  { id: 1, username: "admin",       password: "admin123", name: "System Administrator", email: "admin@aurumhotel.lk",     phone: "+94 11 244 5555", permissions: "FULL" },
  { id: 2, username: "moderator1",  password: "mod123",   name: "Sandali Wickrama",     email: "sandali@aurumhotel.lk",   phone: "+94 71 222 3344", permissions: "MODERATOR" },
  { id: 3, username: "viewer1",     password: "view123",  name: "Ranga Bandara",        email: "ranga@aurumhotel.lk",     phone: "+94 76 555 8899", permissions: "VIEWER" },
];

type Tab = "dashboard" | "list" | "add";

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>(seed);
  const [tab, setTab] = useState<Tab>("dashboard");

  // CREATE
  const [form, setForm] = useState<Omit<Admin, "id">>({
    username: "", password: "", name: "", email: "", phone: "+94 ", permissions: "MODERATOR"
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (admins.find(a => a.username.toLowerCase() === form.username.toLowerCase())) {
      alert("Username already taken.");
      return;
    }
    const next = { ...form, id: Math.max(...admins.map(a => a.id), 0) + 1 };
    setAdmins([...admins, next]);
    alert(`✓ Admin '${next.username}' added.`);
    setForm({ username: "", password: "", name: "", email: "", phone: "+94 ", permissions: "MODERATOR" });
    setTab("list");
  };

  // UPDATE
  const updatePerm = (id: number, perm: Permissions) => {
    setAdmins(admins.map(a => a.id === id ? { ...a, permissions: perm } : a));
    alert(`✓ Permissions updated.`);
  };

  // DELETE
  const handleDelete = (id: number) => {
    if (id === 1) return alert("Cannot delete the default system admin.");
    if (!confirm(`Delete admin #${id}?`)) return;
    setAdmins(admins.filter(a => a.id !== id));
  };

  const stats = {
    total: admins.length,
    full: admins.filter(a => a.permissions === "FULL").length,
    mod: admins.filter(a => a.permissions === "MODERATOR").length,
    viewer: admins.filter(a => a.permissions === "VIEWER").length,
  };

  return (
    <section className="admin-mgmt">
      <h1 className="admin-mgmt__title">Admin Management</h1>
      <p className="admin-mgmt__subtitle">Component 05 · Inheritance + Abstraction</p>

      <nav className="admin-tabs">
        <button className={`admin-tab ${tab==="dashboard"?"admin-tab--active":""}`} onClick={() => setTab("dashboard")}>Dashboard</button>
        <button className={`admin-tab ${tab==="list"?"admin-tab--active":""}`} onClick={() => setTab("list")}>Admin List</button>
        <button className={`admin-tab ${tab==="add"?"admin-tab--active":""}`} onClick={() => setTab("add")}>Add Admin</button>
      </nav>

      {/* === DASHBOARD === */}
      {tab === "dashboard" && (
        <>
          <div className="admin-stats">
            <div className="admin-stat"><div className="admin-stat__num">{stats.total}</div><div className="admin-stat__label">Total Admins</div></div>
            <div className="admin-stat"><div className="admin-stat__num">{stats.full}</div><div className="admin-stat__label">Full Access</div></div>
            <div className="admin-stat"><div className="admin-stat__num">{stats.mod}</div><div className="admin-stat__label">Moderators</div></div>
            <div className="admin-stat"><div className="admin-stat__num">{stats.viewer}</div><div className="admin-stat__label">Viewers</div></div>
          </div>
          <div className="admin-grid">
            {admins.map(a => (
              <article key={a.id} className="admin-card">
                {a.permissions === "FULL" && <span className="admin-card__crown">👑</span>}
                <div className="admin-card__avatar">{a.name.charAt(0)}</div>
                <div className="admin-card__name">{a.name}</div>
                <div className="admin-card__user">@{a.username} · #{a.id}</div>
                <div className={`admin-card__perm admin-card__perm--${a.permissions.toLowerCase()}`}>
                  {a.permissions}
                </div>
                <div className="admin-card__info">{a.email}</div>
                <div className="admin-card__info">{a.phone}</div>
              </article>
            ))}
          </div>
        </>
      )}

      {/* === LIST === */}
      {tab === "list" && (
        <div className="admin-grid">
          {admins.map(a => (
            <article key={a.id} className="admin-card">
              {a.permissions === "FULL" && <span className="admin-card__crown">👑</span>}
              <div className="admin-card__avatar">{a.name.charAt(0)}</div>
              <div className="admin-card__name">{a.name}</div>
              <div className="admin-card__user">@{a.username} · #{a.id}</div>
              <div className={`admin-card__perm admin-card__perm--${a.permissions.toLowerCase()}`}>{a.permissions}</div>
              <div className="admin-card__info">{a.email}</div>
              <div className="admin-card__info">{a.phone}</div>
              <div className="admin-form__field" style={{ marginTop: "0.75rem" }}>
                <label className="admin-form__label">Change Permissions</label>
                <select className="admin-form__select"
                  value={a.permissions}
                  onChange={e => updatePerm(a.id, e.target.value as Permissions)}>
                  <option value="FULL">FULL</option>
                  <option value="MODERATOR">MODERATOR</option>
                  <option value="VIEWER">VIEWER</option>
                </select>
              </div>
              <div className="admin-card__actions">
                <button className="admin-card__btn admin-card__btn--del" onClick={() => handleDelete(a.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* === ADD === */}
      {tab === "add" && (
        <form className="admin-form" onSubmit={handleAdd}>
          <div className="admin-form__field">
            <label className="admin-form__label">Username</label>
            <input className="admin-form__input" required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Password</label>
            <input className="admin-form__input" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Full Name</label>
            <input className="admin-form__input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Email</label>
            <input className="admin-form__input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Phone (Sri Lankan)</label>
            <input className="admin-form__input" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="admin-form__field">
            <label className="admin-form__label">Permissions</label>
            <select className="admin-form__select" value={form.permissions}
              onChange={e => setForm({ ...form, permissions: e.target.value as Permissions })}>
              <option value="FULL">FULL — manage everything</option>
              <option value="MODERATOR">MODERATOR — manage bookings + reviews</option>
              <option value="VIEWER">VIEWER — read-only</option>
            </select>
          </div>
          <button className="admin-form__btn" type="submit">Add Admin</button>
        </form>
      )}
    </section>
  );
}
