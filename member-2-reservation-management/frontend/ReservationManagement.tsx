import { useState } from "react";
import "../styles/reservation-management.css";

/**
 * Member 2 — Reservation Management Component
 * CRUD UI for reservations. Sorts by check-in date (mirroring backend QuickSort).
 */

interface Reservation {
  id: number;
  customerId: number;
  roomNumber: number;
  checkIn: string;          // YYYY-MM-DD
  checkOut: string;
  status: "CONFIRMED" | "CANCELLED" | "CHECKED_IN" | "CHECKED_OUT";
  totalAmount: number;      // LKR
  source: "ONLINE" | "WALK_IN";
}

const seed: Reservation[] = [
  { id: 1001, customerId: 1, roomNumber: 101, checkIn: "2026-01-15", checkOut: "2026-01-18", status: "CONFIRMED", totalAmount: 495_000, source: "ONLINE" },
  { id: 1002, customerId: 2, roomNumber: 201, checkIn: "2026-02-10", checkOut: "2026-02-14", status: "CONFIRMED", totalAmount: 1_344_000, source: "ONLINE" },
  { id: 1003, customerId: 3, roomNumber: 301, checkIn: "2026-01-20", checkOut: "2026-01-22", status: "CHECKED_IN", totalAmount: 1_750_000, source: "WALK_IN" },
];

type Tab = "list" | "book" | "edit";

// QuickSort by check-in date — mirrors backend
const quickSort = (arr: Reservation[]): Reservation[] => {
  if (arr.length < 2) return arr;
  const pivot = arr[arr.length - 1];
  const left  = arr.slice(0, -1).filter(r => r.checkIn <= pivot.checkIn);
  const right = arr.slice(0, -1).filter(r => r.checkIn  > pivot.checkIn);
  return [...quickSort(left), pivot, ...quickSort(right)];
};

export default function ReservationManagement() {
  const [reservations, setReservations] = useState<Reservation[]>(seed);
  const [tab, setTab] = useState<Tab>("list");

  // CREATE form
  const [form, setForm] = useState<Omit<Reservation, "id">>({
    customerId: 1, roomNumber: 101,
    checkIn: "", checkOut: "",
    status: "CONFIRMED", totalAmount: 0, source: "ONLINE"
  });

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.checkIn >= form.checkOut) {
      alert("Check-out must be after check-in.");
      return;
    }
    const next = { ...form, id: Math.max(...reservations.map(r => r.id), 1000) + 1 };
    setReservations([...reservations, next]);
    alert(`✓ Reservation #${next.id} created.`);
    setForm({ customerId: 1, roomNumber: 101, checkIn: "", checkOut: "", status: "CONFIRMED", totalAmount: 0, source: "ONLINE" });
    setTab("list");
  };

  // EDIT
  const [editId, setEditId] = useState<number | null>(null);
  const editing = editId !== null ? reservations.find(r => r.id === editId) : null;
  const [editCi, setEditCi] = useState("");
  const [editCo, setEditCo] = useState("");
  const [editRoom, setEditRoom] = useState("");

  const startEdit = (r: Reservation) => {
    setEditId(r.id);
    setEditCi(r.checkIn);
    setEditCo(r.checkOut);
    setEditRoom(r.roomNumber.toString());
    setTab("edit");
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (editCi >= editCo) { alert("Invalid dates."); return; }
    setReservations(reservations.map(r => r.id === editing.id
      ? { ...r, checkIn: editCi, checkOut: editCo, roomNumber: parseInt(editRoom, 10) || r.roomNumber }
      : r));
    alert(`✓ Reservation #${editing.id} updated.`);
    setEditId(null);
    setTab("list");
  };

  // DELETE / Cancel
  const cancel = (id: number) => {
    if (!confirm(`Cancel reservation #${id}?`)) return;
    setReservations(reservations.map(r => r.id === id ? { ...r, status: "CANCELLED" as const } : r));
    alert(`✓ Reservation #${id} cancelled.`);
  };

  const remove = (id: number) => {
    if (!confirm(`Permanently remove reservation #${id}?`)) return;
    setReservations(reservations.filter(r => r.id !== id));
  };

  const sorted = quickSort([...reservations]);

  return (
    <section className="res-mgmt">
      <h1 className="res-mgmt__title">Reservation Management</h1>
      <p className="res-mgmt__subtitle">Component 02 · Quick Sort</p>

      <nav className="res-tabs">
        <button className={`res-tab ${tab==="list"?"res-tab--active":""}`} onClick={() => setTab("list")}>Reservation List</button>
        <button className={`res-tab ${tab==="book"?"res-tab--active":""}`} onClick={() => setTab("book")}>New Booking</button>
        <button className={`res-tab ${tab==="edit"?"res-tab--active":""}`} onClick={() => setTab("edit")}>Edit Reservation</button>
      </nav>

      {/* === LIST === */}
      {tab === "list" && (
        <>
          <div className="res-summary">
            Showing {sorted.length} reservations · sorted by check-in date (Quick Sort)
          </div>
          <div className="res-table-wrap">
            <table className="res-table">
              <thead>
                <tr>
                  <th>ID</th><th>Customer</th><th>Room</th>
                  <th>Check-in</th><th>Check-out</th>
                  <th>Status</th><th>Source</th><th>Amount</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(r => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>Cust #{r.customerId}</td>
                    <td>Room #{r.roomNumber}</td>
                    <td>{r.checkIn}</td>
                    <td>{r.checkOut}</td>
                    <td><span className={`res-status res-status--${r.status.toLowerCase()}`}>{r.status}</span></td>
                    <td><span className="res-source">{r.source}</span></td>
                    <td>LKR {r.totalAmount.toLocaleString()}</td>
                    <td>
                      <button className="res-action-btn" onClick={() => startEdit(r)}>Edit</button>
                      {r.status !== "CANCELLED" && (
                        <button className="res-action-btn res-action-btn--danger" onClick={() => cancel(r.id)}>Cancel</button>
                      )}
                      <button className="res-action-btn res-action-btn--danger" onClick={() => remove(r.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* === BOOK === */}
      {tab === "book" && (
        <form className="res-form" onSubmit={handleBook}>
          <div className="res-form__row">
            <div className="res-form__field">
              <label className="res-form__label">Customer ID</label>
              <input className="res-form__input" type="number" required
                value={form.customerId}
                onChange={e => setForm({ ...form, customerId: parseInt(e.target.value, 10) || 0 })} />
            </div>
            <div className="res-form__field">
              <label className="res-form__label">Room Number</label>
              <input className="res-form__input" type="number" required
                value={form.roomNumber}
                onChange={e => setForm({ ...form, roomNumber: parseInt(e.target.value, 10) || 0 })} />
            </div>
          </div>
          <div className="res-form__row">
            <div className="res-form__field">
              <label className="res-form__label">Check-in</label>
              <input className="res-form__input" type="date" required
                value={form.checkIn} onChange={e => setForm({ ...form, checkIn: e.target.value })} />
            </div>
            <div className="res-form__field">
              <label className="res-form__label">Check-out</label>
              <input className="res-form__input" type="date" required
                value={form.checkOut} onChange={e => setForm({ ...form, checkOut: e.target.value })} />
            </div>
          </div>
          <div className="res-form__row">
            <div className="res-form__field">
              <label className="res-form__label">Total Amount (LKR)</label>
              <input className="res-form__input" type="number" required
                value={form.totalAmount}
                onChange={e => setForm({ ...form, totalAmount: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="res-form__field">
              <label className="res-form__label">Source (Polymorphism)</label>
              <select className="res-form__select"
                value={form.source}
                onChange={e => setForm({ ...form, source: e.target.value as "ONLINE" | "WALK_IN" })}>
                <option value="ONLINE">Online Reservation</option>
                <option value="WALK_IN">Walk-In Reservation</option>
              </select>
            </div>
          </div>
          <button className="res-form__btn" type="submit">Confirm Booking</button>
        </form>
      )}

      {/* === EDIT === */}
      {tab === "edit" && (
        <div className="res-form">
          {!editing ? (
            <p style={{ textAlign: "center", color: "#999" }}>
              Select a reservation from the list to edit.
            </p>
          ) : (
            <form onSubmit={handleUpdate}>
              <h3 style={{ color: "#D4A853", marginBottom: "1rem" }}>
                Editing Reservation #{editing.id}
              </h3>
              <div className="res-form__row">
                <div className="res-form__field">
                  <label className="res-form__label">Check-in</label>
                  <input className="res-form__input" type="date" required
                    value={editCi} onChange={e => setEditCi(e.target.value)} />
                </div>
                <div className="res-form__field">
                  <label className="res-form__label">Check-out</label>
                  <input className="res-form__input" type="date" required
                    value={editCo} onChange={e => setEditCo(e.target.value)} />
                </div>
              </div>
              <div className="res-form__field">
                <label className="res-form__label">Room Number</label>
                <input className="res-form__input" type="number"
                  value={editRoom} onChange={e => setEditRoom(e.target.value)} />
              </div>
              <button className="res-form__btn" type="submit">Update Reservation</button>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
