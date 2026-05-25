import { useState, type FormEvent } from "react";
import "../styles/customer-management.css";

/**
 * Member 3 — Customer Management Component
 * Tabs: Register | Login | Profile | Customer List
 */
// Concepts Used:
//React Hooks,TypeScript Interfaces,CRUD Operations,Polymorphism Simulation,State Management
interface Customer {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;     // Sri Lankan format
  address: string;
  type: "REGULAR" | "VIP";
}
//Used as initial data when component loads
const seed: Customer[] = [
  { id: 1, username: "amal",   password: "1234", name: "Amal Perera",      email: "amal@example.lk",   phone: "+94 77 123 4567", address: "123, Galle Road, Colombo 03",     type: "REGULAR" },
  { id: 2, username: "nimali", password: "5678", name: "Nimali Silva",     email: "nimali@example.lk", phone: "+94 71 987 6543", address: "45, Marine Drive, Mount Lavinia", type: "VIP" },
  { id: 3, username: "kasun",  password: "abcd", name: "Kasun Fernando",   email: "kasun@example.lk",  phone: "+94 76 555 1234", address: "12, Temple Road, Kandy",          type: "REGULAR" },
];

type Tab = "list" | "register" | "login" | "profile";

// noinspection JSUnusedGlobalSymbols
export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>(seed);
  const [tab, setTab] = useState<Tab>("list");
  const [loggedIn, setLoggedIn] = useState<Customer | null>(null);

  // CREATE / Register
  const [reg, setReg] = useState<Omit<Customer, "id">>({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "+94 ",
    address: "",
    type: "REGULAR",
  });

  //Handles customer registration
  const handleRegister = (e: FormEvent) => {
    e.preventDefault();// Prevent page reload

    if (customers.find((c) => c.username.toLowerCase() === reg.username.toLowerCase())) {
      window.alert("Username already taken.");
      return;
    }
    const next = { ...reg, id: Math.max(...customers.map((c) => c.id), 0) + 1 };
    setCustomers([...customers, next]);
    window.alert(`✓ Registered! Customer ID: ${next.id}`);
    setReg({ username: "", password: "", name: "", email: "", phone: "+94 ", address: "", type: "REGULAR" });
    setTab("list");
  };

  // Login
  //// Login username input
  const [loginUser, setLoginUser] = useState(""); // Login username input
  const [loginPass, setLoginPass] = useState(""); //password

  const handleLogin = (e: FormEvent) => { // Handles login process
    e.preventDefault();// Prevent page reload
    const found = customers.find((c) => c.username === loginUser && c.password === loginPass);// Find matching customer credentials
    if (!found) {
      window.alert("Invalid credentials.");
      return;
    }
    setLoggedIn(found);
    setTab("profile"); // Switch to profile tab
    window.alert(`✓ Welcome, ${found.name}!`);
  };

  // UPDATE / Profile
  const [pEmail, setPEmail] = useState(""); // Editable profile emai
  const [pPhone, setPPhone] = useState("");
  const [pAddress, setPAddress] = useState("");

  const startProfileEdit = () => { // Loads customer data into edit form
    if (!loggedIn) return;
    setPEmail(loggedIn.email);
    setPPhone(loggedIn.phone);
    setPAddress(loggedIn.address);
  };

  const handleProfileSave = (e: FormEvent) => {
    e.preventDefault();
    if (!loggedIn) return;
    const next = customers.map((c) =>
      c.id === loggedIn.id
        ? { ...c, email: pEmail || c.email, phone: pPhone || c.phone, address: pAddress || c.address }
        : c
    );
    setCustomers(next);
    setLoggedIn({
      ...loggedIn,
      email: pEmail || loggedIn.email,
      phone: pPhone || loggedIn.phone,
      address: pAddress || loggedIn.address,
    });
    window.alert("✓ Profile updated."); // Success message
  };

  // DELETE
  // Deletes customer by ID
  const handleDelete = (id: number) => {
    if (!window.confirm(`Delete customer #${id}?`)) return;// Ask confirmation before deleting
    setCustomers(customers.filter((c) => c.id !== id));// Remove matching customer
  };

  // Upgrade to VIP
  const upgradeVIP = (id: number) => {
    setCustomers(customers.map((c) => (c.id === id ? { ...c, type: "VIP" as const } : c)));
    window.alert(`✓ Customer #${id} upgraded to VIP.`);
  };

  // SEARCH
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const filtered = searchQuery
    ? customers.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : customers;

  // Polymorphism demo (calculateDiscount in JS)
  // Calculates discount based on customer type
  const discount = (amt: number, t: "REGULAR" | "VIP") => (t === "VIP" ? amt * 0.15 : amt * 0.05);
  //Page title1
  //Customer list tab
  return (
    <section className="cust-mgmt">
      <h1 className="cust-mgmt__title">Customer Management</h1>
      <p className="cust-mgmt__subtitle">Component 03 · Inheritance + Polymorphism</p>

      <nav className="cust-tabs">
        <button className={`cust-tab ${tab === "list" ? "cust-tab--active" : ""}`} onClick={() => setTab("list")}>Customer List</button>
        <button className={`cust-tab ${tab === "register" ? "cust-tab--active" : ""}`} onClick={() => setTab("register")}>Register</button>
        <button className={`cust-tab ${tab === "login" ? "cust-tab--active" : ""}`} onClick={() => setTab("login")}>Login</button>
        <button className={`cust-tab ${tab === "profile" ? "cust-tab--active" : ""}`} onClick={() => { setTab("profile"); startProfileEdit(); }}>My Profile</button>
      </nav>

      {/* === LIST + SEARCH === */}
      {tab === "list" && (
        <>
          <div className="cust-search-bar">
            <input
              className="cust-form__input"
              placeholder="Search customers by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="cust-grid">
            {filtered.map((c) => (
              <article key={c.id} className="cust-card">
                <div className="cust-card__avatar">{c.name.charAt(0)}</div>
                <div className={`cust-card__type-badge cust-card__type-badge--${c.type.toLowerCase()}`}>
                  {c.type === "VIP" ? "★ VIP" : "Regular"}
                </div>
                <div className="cust-card__name">{c.name}</div>
                <div className="cust-card__id">Cust #{c.id} · @{c.username}</div>

                <div className="cust-card__row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {c.email}
                </div>

                <div className="cust-card__row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  {c.phone}
                </div>

                <div className="cust-card__row">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {c.address}
                </div>

                <div className="cust-discount-info">
                  Discount: {c.type === "VIP" ? "15%" : "5%"} on bookings · Example savings on LKR 100,000: LKR {discount(100000, c.type).toLocaleString()}
                </div>

                <div className="cust-card__actions">
                  {c.type === "REGULAR" && (
                    <button className="cust-card__btn cust-card__btn--vip" onClick={() => upgradeVIP(c.id)}>↑ VIP</button>
                  )}
                  <button className="cust-card__btn cust-card__btn--del" onClick={() => handleDelete(c.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {/* === REGISTER === */}
      {tab === "register" && (
        <form className="cust-form" onSubmit={handleRegister}>
          <div className="cust-form__field">
            <label className="cust-form__label">Username</label>
            <input className="cust-form__input" required value={reg.username} onChange={(e) => setReg({ ...reg, username: e.target.value })} />
          </div>
          <div className="cust-form__field">
            <label className="cust-form__label">Password</label>
            <input className="cust-form__input" type="password" required value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} />
          </div>
          <div className="cust-form__field">
            <label className="cust-form__label">Full Name</label>
            <input className="cust-form__input" required value={reg.name} onChange={(e) => setReg({ ...reg, name: e.target.value })} />
          </div>
          <div className="cust-form__field">
            <label className="cust-form__label">Email</label>
            <input className="cust-form__input" type="email" required value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} />
          </div>
          <div className="cust-form__field">
            <label className="cust-form__label">Phone (Sri Lankan)</label>
            <input className="cust-form__input" placeholder="+94 77 123 4567" required value={reg.phone} onChange={(e) => setReg({ ...reg, phone: e.target.value })} />
          </div>
          <div className="cust-form__field">
            <label className="cust-form__label">Address (Sri Lanka)</label>
            <textarea className="cust-form__textarea" rows={2} placeholder="123, Galle Road, Colombo 03" required value={reg.address} onChange={(e) => setReg({ ...reg, address: e.target.value })} />
          </div>
          <div className="cust-form__field">
            <label className="cust-form__label">Customer Type</label>
            <select className="cust-form__select" value={reg.type} onChange={(e) => setReg({ ...reg, type: e.target.value as "REGULAR" | "VIP" })}>
              <option value="REGULAR">Regular Customer (5% discount)</option>
              <option value="VIP">VIP Customer (15% discount)</option>
            </select>
          </div>
          <button className="cust-form__btn" type="submit">Register</button>
        </form>
      )}

      {/* === LOGIN === */}
      {tab === "login" && !loggedIn && (
        <form className="cust-form" onSubmit={handleLogin}>
          <div className="cust-form__field">
            <label className="cust-form__label">Username</label>
            <input className="cust-form__input" required value={loginUser} onChange={(e) => setLoginUser(e.target.value)} />
          </div>
          <div className="cust-form__field">
            <label className="cust-form__label">Password</label>
            <input className="cust-form__input" type="password" required value={loginPass} onChange={(e) => setLoginPass(e.target.value)} />
          </div>
          <button className="cust-form__btn" type="submit">Login</button>
        </form>
      )}

      {/* === PROFILE === */}
      {tab === "profile" && (
        loggedIn ? (
          <form className="cust-form" onSubmit={handleProfileSave}>
            <h3 style={{ color: "#D4A853", marginBottom: "0.5rem" }}>{loggedIn.name}</h3>
            <div className="cust-discount-info">
              {loggedIn.type === "VIP"
                ? `★ VIP Customer · 15% discount · Example savings on LKR 100,000: LKR ${discount(100000, "VIP").toLocaleString()}`
                : `Regular Customer · 5% discount · Example savings on LKR 100,000: LKR ${discount(100000, "REGULAR").toLocaleString()}`}
            </div>
            <div className="cust-form__field" style={{ marginTop: "1.5rem" }}>
              <label className="cust-form__label">Email</label>
              <input className="cust-form__input" type="email" value={pEmail} onChange={(e) => setPEmail(e.target.value)} />
            </div>
            <div className="cust-form__field">
              <label className="cust-form__label">Phone</label>
              <input className="cust-form__input" value={pPhone} onChange={(e) => setPPhone(e.target.value)} />
            </div>
            <div className="cust-form__field">
              <label className="cust-form__label">Address</label>
              <textarea className="cust-form__textarea" rows={2} value={pAddress} onChange={(e) => setPAddress(e.target.value)} />
            </div>
            <button className="cust-form__btn" type="submit">Save Changes</button>
            <button
              className="cust-form__btn"
              type="button"
              style={{ background: "#333", color: "#fff", marginTop: "0.5rem" }}
              onClick={() => {
                setLoggedIn(null);
                setTab("login");
              }}
            >
              Logout
            </button>
          </form>
        ) : (
          <p style={{ textAlign: "center", color: "#999" }}>Please log in to view your profile.</p>
        )
      )}
    </section>
  );
}
