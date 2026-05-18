import { useState } from "react";
import "../styles/service-management.css";

/**
 * Member 6 — Service & Facility Management Component
 * Tabs: Service List | Add Service | Edit Service | Customer Requests | Request Service
 */

type Tier = "PREMIUM" | "BASIC";
type Category = "SPA" | "DINING" | "TRANSPORT" | "ROOM" | "OTHER";

interface Service {
  id: number;
  name: string;
  price: number;        // LKR
  available: boolean;
  description: string;
  category: Category;
  tier: Tier;
}

interface CustomerSvcRequest {
  id: number;
  customerId: number;
  reservationId: number;
  serviceId: number;
  quantity: number;
  totalPrice: number;
  status: "REQUESTED" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
}

const seedServices: Service[] = [
  { id: 1, name: "Royal Gold Facial",   price: 105_000, available: true, description: "90 min luxury facial",      category: "SPA",       tier: "PREMIUM" },
  { id: 2, name: "Deep Tissue Massage", price:  72_000, available: true, description: "60 min therapeutic massage", category: "SPA",       tier: "PREMIUM" },
  { id: 3, name: "Aromatherapy Journey",price:  92_000, available: true, description: "75 min aromatherapy",        category: "SPA",       tier: "PREMIUM" },
  { id: 4, name: "Hot Stone Therapy",   price: 115_000, available: true, description: "90 min hot stone therapy",   category: "SPA",       tier: "PREMIUM" },
  { id: 5, name: "Wi-Fi (Premium)",     price:   2_500, available: true, description: "High-speed unlimited",       category: "ROOM",      tier: "BASIC" },
  { id: 6, name: "Breakfast Buffet",    price:  12_000, available: true, description: "Continental + Sri Lankan",   category: "DINING",    tier: "BASIC" },
  { id: 7, name: "Airport Pickup",      price:  18_000, available: true, description: "BIA Colombo → Hotel",        category: "TRANSPORT", tier: "BASIC" },
  { id: 8, name: "Valet Parking",       price:   5_000, available: true, description: "24/7 secured parking",       category: "TRANSPORT", tier: "BASIC" },
];

const seedRequests: CustomerSvcRequest[] = [
  { id: 1, customerId: 1, reservationId: 1001, serviceId: 1, quantity: 1, totalPrice: 115_500,  status: "DELIVERED" },
  { id: 2, customerId: 2, reservationId: 1002, serviceId: 6, quantity: 4, totalPrice:  48_000,  status: "CONFIRMED" },
];

type Tab = "list" | "add" | "edit" | "requests" | "request";
const categoryIcon = (c: Category) => c === "SPA" ? "💆" : c === "DINING" ? "🍽️" : c === "TRANSPORT" ? "🚗" : c === "ROOM" ? "🛏️" : "✨";
const calculatePrice = (s: Service, qty: number) => s.tier === "PREMIUM" ? s.price * qty * 1.1 : s.price * qty;

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>(seedServices);
  const [requests, setRequests] = useState<CustomerSvcRequest[]>(seedRequests);
  const [tab, setTab] = useState<Tab>("list");
  const [filterCat, setFilterCat] = useState<Category | "ALL">("ALL");

  // CREATE service
  const [form, setForm] = useState<Omit<Service, "id">>({
    name: "", price: 0, available: true, description: "", category: "SPA", tier: "BASIC"
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const next = { ...form, id: Math.max(...services.map(s => s.id), 0) + 1 };
    setServices([...services, next]);
    alert(`✓ Service "${next.name}" added.`);
    setForm({ name: "", price: 0, available: true, description: "", category: "SPA", tier: "BASIC" });
    setTab("list");
  };

  // UPDATE service
  const [editId, setEditId] = useState<number | null>(null);
  const editing = editId !== null ? services.find(s => s.id === editId) : null;
  const [editPrice, setEditPrice] = useState("");
  const [editAvail, setEditAvail] = useState<"true" | "false">("true");
  const [editDesc, setEditDesc] = useState("");

  const startEdit = (s: Service) => {
    setEditId(s.id);
    setEditPrice(s.price.toString());
    setEditAvail(s.available ? "true" : "false");
    setEditDesc(s.description);
    setTab("edit");
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setServices(services.map(s => s.id === editing.id
      ? { ...s, price: parseFloat(editPrice) || s.price, available: editAvail === "true", description: editDesc || s.description }
      : s));
    alert(`✓ Service "${editing.name}" updated.`);
    setEditId(null);
    setTab("list");
  };

  // DELETE
  const handleDelete = (id: number) => {
    if (!confirm("Delete this service?")) return;
    setServices(services.filter(s => s.id !== id));
  };

  // REQUEST service (Customer flow)
  const [reqSvcId, setReqSvcId] = useState("");
  const [reqQty,   setReqQty]   = useState(1);
  const [reqRes,   setReqRes]   = useState("1001");
  const [reqCust,  setReqCust]  = useState("1");
  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const svc = services.find(s => s.id === parseInt(reqSvcId, 10));
    if (!svc) return alert("Service not found.");
    if (!svc.available) return alert("Service unavailable.");
    const next: CustomerSvcRequest = {
      id: Math.max(...requests.map(r => r.id), 0) + 1,
      customerId: parseInt(reqCust, 10) || 0,
      reservationId: parseInt(reqRes, 10) || 0,
      serviceId: svc.id,
      quantity: reqQty,
      totalPrice: calculatePrice(svc, reqQty),
      status: "REQUESTED",
    };
    setRequests([...requests, next]);
    alert(`✓ Service requested. Total: LKR ${next.totalPrice.toLocaleString()}`);
    setReqSvcId(""); setReqQty(1);
    setTab("requests");
  };

  // Update / cancel request status
  const setReqStatus = (id: number, status: CustomerSvcRequest["status"]) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
  };
  const removeRequest = (id: number) => {
    if (!confirm("Remove this request?")) return;
    setRequests(requests.filter(r => r.id !== id));
  };

  const filtered = filterCat === "ALL" ? services : services.filter(s => s.category === filterCat);

  return (
    <section className="svc-mgmt">
      <h1 className="svc-mgmt__title">Service & Facility Management</h1>
      <p className="svc-mgmt__subtitle">Component 07 · Inheritance + Polymorphism</p>

      <nav className="svc-tabs">
        <button className={`svc-tab ${tab==="list"?"svc-tab--active":""}`} onClick={() => setTab("list")}>Service List</button>
        <button className={`svc-tab ${tab==="add"?"svc-tab--active":""}`} onClick={() => setTab("add")}>Add Service</button>
        <button className={`svc-tab ${tab==="edit"?"svc-tab--active":""}`} onClick={() => setTab("edit")}>Edit Service</button>
        <button className={`svc-tab ${tab==="request"?"svc-tab--active":""}`} onClick={() => setTab("request")}>Request Service</button>
        <button className={`svc-tab ${tab==="requests"?"svc-tab--active":""}`} onClick={() => setTab("requests")}>Customer Requests ({requests.length})</button>
      </nav>

      {/* === LIST === */}
      {tab === "list" && (
        <>
          <div className="svc-cats">
            {(["ALL","SPA","DINING","TRANSPORT","ROOM","OTHER"] as const).map(c => (
              <button key={c}
                className={`svc-cat ${filterCat === c ? "svc-cat--active" : ""}`}
                onClick={() => setFilterCat(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="svc-grid">
            {filtered.map(s => (
              <article key={s.id}
                className={`svc-card ${s.tier === "PREMIUM" ? "svc-card--premium" : ""} ${!s.available ? "svc-card--unavailable" : ""}`}>
                <div className="svc-card__icon">{categoryIcon(s.category)}</div>
                <div className="svc-card__name">{s.name}</div>
                <span className="svc-card__category">{s.category}</span>
                <p className="svc-card__desc">{s.description}</p>
                <div className="svc-card__price">LKR {s.price.toLocaleString()}</div>
                <div className="svc-card__tax">{s.tier === "PREMIUM" ? "+10% luxury tax" : "Flat rate"}</div>
                <div className="svc-card__actions">
                  <button className="svc-card__btn" onClick={() => startEdit(s)}>Edit</button>
                  <button className="svc-card__btn svc-card__btn--del" onClick={() => handleDelete(s.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {/* === ADD === */}
      {tab === "add" && (
        <form className="svc-form" onSubmit={handleAdd}>
          <div className="svc-form__field">
            <label className="svc-form__label">Service Name</label>
            <input className="svc-form__input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="svc-form__field">
            <label className="svc-form__label">Price (LKR)</label>
            <input className="svc-form__input" type="number" required value={form.price || ""} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
          </div>
          <div className="svc-form__field">
            <label className="svc-form__label">Description</label>
            <textarea className="svc-form__textarea" rows={3} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="svc-form__field">
            <label className="svc-form__label">Category</label>
            <select className="svc-form__select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Category })}>
              <option value="SPA">SPA</option>
              <option value="DINING">DINING</option>
              <option value="TRANSPORT">TRANSPORT</option>
              <option value="ROOM">ROOM</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
          <div className="svc-form__field">
            <label className="svc-form__label">Tier (Polymorphism)</label>
            <select className="svc-form__select" value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value as Tier })}>
              <option value="BASIC">BASIC — flat price × qty</option>
              <option value="PREMIUM">PREMIUM — +10% luxury tax</option>
            </select>
          </div>
          <div className="svc-form__field">
            <label className="svc-form__label">Availability</label>
            <select className="svc-form__select" value={form.available ? "true" : "false"} onChange={e => setForm({ ...form, available: e.target.value === "true" })}>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
          <button className="svc-form__btn" type="submit">Add Service</button>
        </form>
      )}

      {/* === EDIT === */}
      {tab === "edit" && (
        <div className="svc-form">
          {!editing ? (
            <p style={{ textAlign: "center", color: "#999" }}>Select a service from the list to edit.</p>
          ) : (
            <form onSubmit={handleUpdate}>
              <h3 style={{ color: "#D4A853", marginBottom: "1rem" }}>Editing: {editing.name}</h3>
              <div className="svc-form__field">
                <label className="svc-form__label">New Price (LKR)</label>
                <input className="svc-form__input" type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} />
              </div>
              <div className="svc-form__field">
                <label className="svc-form__label">Availability</label>
                <select className="svc-form__select" value={editAvail} onChange={e => setEditAvail(e.target.value as "true" | "false")}>
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
              <div className="svc-form__field">
                <label className="svc-form__label">Description</label>
                <textarea className="svc-form__textarea" rows={3} value={editDesc} onChange={e => setEditDesc(e.target.value)} />
              </div>
              <button className="svc-form__btn" type="submit">Update Service</button>
            </form>
          )}
        </div>
      )}

      {/* === CUSTOMER REQUEST FORM === */}
      {tab === "request" && (
        <form className="svc-form" onSubmit={handleRequest}>
          <div className="svc-form__field">
            <label className="svc-form__label">Customer ID</label>
            <input className="svc-form__input" type="number" required value={reqCust} onChange={e => setReqCust(e.target.value)} />
          </div>
          <div className="svc-form__field">
            <label className="svc-form__label">Reservation ID</label>
            <input className="svc-form__input" type="number" required value={reqRes} onChange={e => setReqRes(e.target.value)} />
          </div>
          <div className="svc-form__field">
            <label className="svc-form__label">Service</label>
            <select className="svc-form__select" required value={reqSvcId} onChange={e => setReqSvcId(e.target.value)}>
              <option value="">— Select a service —</option>
              {services.filter(s => s.available).map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.tier}) — LKR {s.price.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
          <div className="svc-form__field">
            <label className="svc-form__label">Quantity</label>
            <input className="svc-form__input" type="number" min="1" required value={reqQty} onChange={e => setReqQty(parseInt(e.target.value, 10) || 1)} />
          </div>
          {reqSvcId && (() => {
            const svc = services.find(s => s.id === parseInt(reqSvcId, 10));
            if (!svc) return null;
            return (
              <div style={{ background: "rgba(212,168,83,0.05)", border: "1px solid rgba(212,168,83,0.2)", padding: "1rem", marginBottom: "1rem" }}>
                <div style={{ color: "#999", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                  Total ({svc.tier === "PREMIUM" ? "with +10% luxury tax" : "flat"})
                </div>
                <div style={{ color: "#D4A853", fontSize: "1.5rem", fontWeight: "bold" }}>
                  LKR {calculatePrice(svc, reqQty).toLocaleString()}
                </div>
              </div>
            );
          })()}
          <button className="svc-form__btn" type="submit">Request Service</button>
        </form>
      )}

      {/* === REQUESTS === */}
      {tab === "requests" && (
        <div className="svc-req-table-wrap">
          <table className="svc-req-table">
            <thead>
              <tr>
                <th>ID</th><th>Customer</th><th>Reservation</th>
                <th>Service</th><th>Qty</th><th>Total</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => {
                const svc = services.find(s => s.id === r.serviceId);
                return (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>Cust #{r.customerId}</td>
                    <td>Res #{r.reservationId}</td>
                    <td>{svc ? svc.name : `Svc #${r.serviceId}`}</td>
                    <td>{r.quantity}</td>
                    <td>LKR {r.totalPrice.toLocaleString()}</td>
                    <td><span className={`svc-req-status svc-req-status--${r.status.toLowerCase()}`}>{r.status}</span></td>
                    <td>
                      {r.status === "REQUESTED" && <button className="svc-tab" style={{ padding: "0.4rem 0.6rem", fontSize: "0.7rem" }} onClick={() => setReqStatus(r.id, "CONFIRMED")}>Confirm</button>}
                      {r.status === "CONFIRMED" && <button className="svc-tab" style={{ padding: "0.4rem 0.6rem", fontSize: "0.7rem", color: "#4ade80", borderColor: "#4ade80" }} onClick={() => setReqStatus(r.id, "DELIVERED")}>Deliver</button>}
                      {r.status !== "CANCELLED" && r.status !== "DELIVERED" && <button className="svc-tab" style={{ padding: "0.4rem 0.6rem", fontSize: "0.7rem", color: "#fbbf24", borderColor: "#fbbf24" }} onClick={() => setReqStatus(r.id, "CANCELLED")}>Cancel</button>}
                      <button className="svc-tab" style={{ padding: "0.4rem 0.6rem", fontSize: "0.7rem", color: "#f87171", borderColor: "#f87171" }} onClick={() => removeRequest(r.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
