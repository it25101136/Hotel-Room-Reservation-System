import { useState } from "react";
import "../styles/room-management.css";

/**
 * Member 1 — Room Management Component
 *
 * CRUD UI for hotel rooms. Mirrors backend BinarySearchTree-based RoomService.
 * Tabs: Add Room | Room List | Search Room | Update Room
 *
 * Default rooms match Aurum website (LKR 150k Deluxe, 280k Suite, 850k Presidential)
 */

interface Room {
  roomNumber: number;
  type: "Standard" | "Deluxe" | "Suite";
  price: number;          // LKR
  available: boolean;
  description: string;
}

const seedRooms: Room[] = [
  { roomNumber: 101, type: "Deluxe",   price: 150_000, available: true,  description: "Elegant Deluxe Room with city view" },
  { roomNumber: 102, type: "Deluxe",   price: 150_000, available: true,  description: "Elegant Deluxe Room with garden view" },
  { roomNumber: 201, type: "Suite",    price: 280_000, available: true,  description: "Executive Suite with separate living area" },
  { roomNumber: 301, type: "Suite",    price: 850_000, available: false, description: "Presidential Suite with private terrace" },
];

type Tab = "list" | "add" | "search" | "update";

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>(seedRooms);
  const [tab, setTab] = useState<Tab>("list");

  // ----- CREATE -----
  const [newRoom, setNewRoom] = useState<Room>({
    roomNumber: 0, type: "Deluxe", price: 0, available: true, description: ""
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (rooms.find(r => r.roomNumber === newRoom.roomNumber)) {
      alert(`Room #${newRoom.roomNumber} already exists.`);
      return;
    }
    // Insert sorted (BST in-order)
    const next = [...rooms, newRoom].sort((a, b) => a.roomNumber - b.roomNumber);
    setRooms(next);
    alert(`✓ Room #${newRoom.roomNumber} added.`);
    setNewRoom({ roomNumber: 0, type: "Deluxe", price: 0, available: true, description: "" });
    setTab("list");
  };

  // ----- READ / SEARCH -----
  const [searchNum, setSearchNum] = useState("");
  const found = searchNum ? rooms.find(r => r.roomNumber === parseInt(searchNum, 10)) : null;

  // ----- UPDATE -----
  const [editNum, setEditNum] = useState("");
  const editingRoom = editNum ? rooms.find(r => r.roomNumber === parseInt(editNum, 10)) : null;
  const [editPrice, setEditPrice] = useState("");
  const [editAvail, setEditAvail] = useState<"true" | "false">("true");
  const [editDesc, setEditDesc] = useState("");

  const loadForEdit = () => {
    if (!editingRoom) return alert("Room not found.");
    setEditPrice(editingRoom.price.toString());
    setEditAvail(editingRoom.available ? "true" : "false");
    setEditDesc(editingRoom.description);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;
    const next = rooms.map(r =>
      r.roomNumber === editingRoom.roomNumber
        ? { ...r, price: parseFloat(editPrice) || r.price, available: editAvail === "true", description: editDesc || r.description }
        : r
    );
    setRooms(next);
    alert(`✓ Room #${editingRoom.roomNumber} updated.`);
    setEditNum("");
  };

  // ----- DELETE -----
  const handleDelete = (n: number) => {
    if (!confirm(`Delete room #${n}?`)) return;
    setRooms(rooms.filter(r => r.roomNumber !== n));
    alert(`✓ Room #${n} deleted.`);
  };

  return (
    <section className="room-mgmt">
      <h1 className="room-mgmt__title">Room Management</h1>
      <p className="room-mgmt__subtitle">Component 01 · Binary Search Tree</p>

      {/* Tabs */}
      <nav className="room-mgmt__tabs">
        {(["list","add","search","update"] as Tab[]).map(t => (
          <button
            key={t}
            className={`room-mgmt__tab ${tab === t ? "room-mgmt__tab--active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "list" ? "Room List" : t === "add" ? "Add Room" : t === "search" ? "Search Room" : "Update Room"}
          </button>
        ))}
      </nav>

      {/* === LIST === */}
      {tab === "list" && (
        rooms.length === 0
          ? <p className="room-mgmt__empty">No rooms in the system.</p>
          : (
            <div className="room-grid">
              {rooms.map(r => (
                <article key={r.roomNumber} className="room-card">
                  <div className="room-card__number">#{r.roomNumber}</div>
                  <span className="room-card__type">{r.type}</span>
                  <div className="room-card__price">
                    LKR {r.price.toLocaleString()} <small>/ night</small>
                  </div>
                  <p className="room-card__desc">{r.description}</p>
                  <div className={`room-card__status room-card__status--${r.available ? "available" : "occupied"}`}>
                    <span className="room-card__dot" />
                    {r.available ? "Available" : "Occupied"}
                  </div>
                  <div className="room-card__actions">
                    <button className="room-card__btn" onClick={() => { setEditNum(r.roomNumber.toString()); setTab("update"); }}>
                      Edit
                    </button>
                    <button className="room-card__btn room-card__btn--del" onClick={() => handleDelete(r.roomNumber)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )
      )}

      {/* === ADD === */}
      {tab === "add" && (
        <form className="room-form" onSubmit={handleAdd}>
          <div className="room-form__field">
            <label className="room-form__label">Room Number</label>
            <input className="room-form__input" type="number" required
              value={newRoom.roomNumber || ""}
              onChange={e => setNewRoom({ ...newRoom, roomNumber: parseInt(e.target.value, 10) || 0 })} />
          </div>
          <div className="room-form__field">
            <label className="room-form__label">Type</label>
            <select className="room-form__select"
              value={newRoom.type}
              onChange={e => setNewRoom({ ...newRoom, type: e.target.value as Room["type"] })}>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
            </select>
          </div>
          <div className="room-form__field">
            <label className="room-form__label">Price (LKR / night)</label>
            <input className="room-form__input" type="number" required
              value={newRoom.price || ""}
              onChange={e => setNewRoom({ ...newRoom, price: parseFloat(e.target.value) || 0 })} />
          </div>
          <div className="room-form__field">
            <label className="room-form__label">Description</label>
            <textarea className="room-form__textarea" rows={3} required
              value={newRoom.description}
              onChange={e => setNewRoom({ ...newRoom, description: e.target.value })} />
          </div>
          <div className="room-form__field">
            <label className="room-form__label">Available</label>
            <select className="room-form__select"
              value={newRoom.available ? "true" : "false"}
              onChange={e => setNewRoom({ ...newRoom, available: e.target.value === "true" })}>
              <option value="true">Available</option>
              <option value="false">Occupied</option>
            </select>
          </div>
          <button className="room-form__btn" type="submit">Add Room</button>
        </form>
      )}

      {/* === SEARCH === */}
      {tab === "search" && (
        <div className="room-form">
          <div className="room-form__field">
            <label className="room-form__label">Search by Room Number (BST search O(log n))</label>
            <input className="room-form__input" type="number"
              value={searchNum}
              onChange={e => setSearchNum(e.target.value)}
              placeholder="e.g. 101" />
          </div>
          {searchNum && (
            found ? (
              <article className="room-card" style={{ marginTop: "1rem" }}>
                <div className="room-card__number">#{found.roomNumber}</div>
                <span className="room-card__type">{found.type}</span>
                <div className="room-card__price">LKR {found.price.toLocaleString()} <small>/ night</small></div>
                <p className="room-card__desc">{found.description}</p>
                <div className={`room-card__status room-card__status--${found.available ? "available" : "occupied"}`}>
                  <span className="room-card__dot" />
                  {found.available ? "Available" : "Occupied"}
                </div>
              </article>
            ) : (
              <p className="room-mgmt__empty">No room found with #{searchNum}</p>
            )
          )}
        </div>
      )}

      {/* === UPDATE === */}
      {tab === "update" && (
        <div className="room-form">
          <div className="room-form__field">
            <label className="room-form__label">Room Number to Update</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input className="room-form__input" type="number"
                value={editNum} onChange={e => setEditNum(e.target.value)} placeholder="e.g. 101" />
              <button className="room-form__btn" style={{ width: "auto", padding: "0 1.5rem" }}
                type="button" onClick={loadForEdit}>Load</button>
            </div>
          </div>
          {editingRoom && (
            <form onSubmit={handleUpdate}>
              <div className="room-form__field">
                <label className="room-form__label">New Price (LKR)</label>
                <input className="room-form__input" type="number"
                  value={editPrice} onChange={e => setEditPrice(e.target.value)} />
              </div>
              <div className="room-form__field">
                <label className="room-form__label">Availability</label>
                <select className="room-form__select"
                  value={editAvail} onChange={e => setEditAvail(e.target.value as "true" | "false")}>
                  <option value="true">Available</option>
                  <option value="false">Occupied</option>
                </select>
              </div>
              <div className="room-form__field">
                <label className="room-form__label">Description</label>
                <textarea className="room-form__textarea" rows={3}
                  value={editDesc} onChange={e => setEditDesc(e.target.value)} />
              </div>
              <button className="room-form__btn" type="submit">Update Room</button>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
