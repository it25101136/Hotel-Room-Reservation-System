import { useState } from "react";
import "../styles/payment-management.css";

/**
 * Member 4 — Payment & Billing Management Component
 * Tabs: Payment | Invoice | Payment History
 */

type PayMethod = "CARD" | "CASH" | "ONLINE";
type PayStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

interface Payment {
  id: number;
  reservationId: number;
  customerId: number;
  amount: number;          // LKR
  status: PayStatus;
  date: string;            // YYYY-MM-DD
  method: PayMethod;
  detail: string;          // last4 / "CASH" / provider
}

const seed: Payment[] = [
  { id: 5001, reservationId: 1001, customerId: 1, amount: 165_000,   status: "COMPLETED", date: "2026-01-10", method: "CARD",   detail: "4321" },
  { id: 5002, reservationId: 1002, customerId: 2, amount: 1_344_000, status: "COMPLETED", date: "2026-02-08", method: "ONLINE", detail: "PayHere" },
  { id: 5003, reservationId: 1003, customerId: 3, amount: 1_750_000, status: "PENDING",   date: "2026-01-20", method: "CASH",   detail: "CASH" },
];

type Tab = "history" | "make" | "invoice";

export default function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>(seed);
  const [tab, setTab] = useState<Tab>("history");

  // CREATE
  const [resId,    setResId]    = useState("");
  const [custId,   setCustId]   = useState("");
  const [amount,   setAmount]   = useState("");
  const [date,     setDate]     = useState(new Date().toISOString().slice(0, 10));
  const [method,   setMethod]   = useState<PayMethod>("CARD");
  const [last4,    setLast4]    = useState("");
  const [provider, setProvider] = useState("PayHere");

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    let detail = "CASH";
    let status: PayStatus = "COMPLETED";
    if (method === "CARD") {
      if (last4.length !== 4) { alert("Card last 4 digits required."); return; }
      detail = last4;
    } else if (method === "ONLINE") {
      detail = provider;
    }
    const next: Payment = {
      id: Math.max(...payments.map(p => p.id), 5000) + 1,
      reservationId: parseInt(resId, 10),
      customerId: parseInt(custId, 10),
      amount: parseFloat(amount),
      status, date, method, detail
    };
    setPayments([...payments, next]);
    setSelectedInvoice(next);
    setTab("invoice");
    alert(`✓ Payment #${next.id} recorded!`);
  };

  // INVOICE
  const [selectedInvoice, setSelectedInvoice] = useState<Payment | null>(null);

  // UPDATE STATUS
  const updateStatus = (id: number, newStatus: PayStatus) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: newStatus } : p));
    alert(`✓ Payment #${id} status → ${newStatus}`);
  };

  // DELETE
  const removePayment = (id: number) => {
    if (!confirm(`Remove payment #${id}?`)) return;
    setPayments(payments.filter(p => p.id !== id));
  };

  const formatMethod = (p: Payment) => {
    if (p.method === "CARD")   return `CARD ****${p.detail}`;
    if (p.method === "ONLINE") return `ONLINE-${p.detail.toUpperCase()}`;
    return "CASH";
  };

  return (
    <section className="pay-mgmt">
      <h1 className="pay-mgmt__title">Payment & Billing</h1>
      <p className="pay-mgmt__subtitle">Component 04 · Abstraction + Polymorphism</p>

      <nav className="pay-tabs">
        <button className={`pay-tab ${tab==="history"?"pay-tab--active":""}`} onClick={() => setTab("history")}>Payment History</button>
        <button className={`pay-tab ${tab==="make"?"pay-tab--active":""}`} onClick={() => setTab("make")}>Make Payment</button>
        <button className={`pay-tab ${tab==="invoice"?"pay-tab--active":""}`} onClick={() => setTab("invoice")}>Invoice</button>
      </nav>

      {/* === HISTORY === */}
      {tab === "history" && (
        <div className="pay-table-wrap">
          <table className="pay-table">
            <thead>
              <tr>
                <th>ID</th><th>Reservation</th><th>Customer</th>
                <th>Amount</th><th>Method</th><th>Date</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>Res #{p.reservationId}</td>
                  <td>Cust #{p.customerId}</td>
                  <td>LKR {p.amount.toLocaleString()}</td>
                  <td><span className="pay-method-tag">{formatMethod(p)}</span></td>
                  <td>{p.date}</td>
                  <td><span className={`pay-status pay-status--${p.status.toLowerCase()}`}>{p.status}</span></td>
                  <td>
                    <button className="pay-tab" style={{ padding: "0.4rem 0.8rem", fontSize: "0.7rem" }}
                      onClick={() => { setSelectedInvoice(p); setTab("invoice"); }}>Invoice</button>
                    {p.status === "COMPLETED" && (
                      <button className="pay-tab" style={{ padding: "0.4rem 0.8rem", fontSize: "0.7rem", color: "#fbbf24", borderColor: "#fbbf24" }}
                        onClick={() => updateStatus(p.id, "REFUNDED")}>Refund</button>
                    )}
                    <button className="pay-tab" style={{ padding: "0.4rem 0.8rem", fontSize: "0.7rem", color: "#f87171", borderColor: "#f87171" }}
                      onClick={() => removePayment(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* === MAKE PAYMENT === */}
      {tab === "make" && (
        <form className="pay-form" onSubmit={handlePay}>
          <div className="pay-methods">
            {(["CARD","CASH","ONLINE"] as PayMethod[]).map(m => (
              <button key={m} type="button"
                className={`pay-method ${method === m ? "pay-method--active" : ""}`}
                onClick={() => setMethod(m)}>
                <div className="pay-method__icon">{m === "CARD" ? "💳" : m === "CASH" ? "💵" : "📱"}</div>
                <div className="pay-method__label">{m}</div>
              </button>
            ))}
          </div>

          <div className="pay-form__field">
            <label className="pay-form__label">Reservation ID</label>
            <input className="pay-form__input" type="number" required
              value={resId} onChange={e => setResId(e.target.value)} />
          </div>
          <div className="pay-form__field">
            <label className="pay-form__label">Customer ID</label>
            <input className="pay-form__input" type="number" required
              value={custId} onChange={e => setCustId(e.target.value)} />
          </div>
          <div className="pay-form__field">
            <label className="pay-form__label">Amount (LKR)</label>
            <input className="pay-form__input" type="number" step="0.01" required
              value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="pay-form__field">
            <label className="pay-form__label">Payment Date</label>
            <input className="pay-form__input" type="date" required
              value={date} onChange={e => setDate(e.target.value)} />
          </div>

          {method === "CARD" && (
            <div className="pay-form__field">
              <label className="pay-form__label">Card Last 4 Digits</label>
              <input className="pay-form__input" maxLength={4} required
                value={last4} onChange={e => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="1234" />
            </div>
          )}
          {method === "ONLINE" && (
            <div className="pay-form__field">
              <label className="pay-form__label">Online Provider</label>
              <select className="pay-form__select" value={provider} onChange={e => setProvider(e.target.value)}>
                <option value="PayHere">PayHere</option>
                <option value="FriMi">FriMi</option>
                <option value="Genie">Genie</option>
              </select>
            </div>
          )}

          <button className="pay-form__btn" type="submit">Process Payment</button>
        </form>
      )}

      {/* === INVOICE === */}
      {tab === "invoice" && (
        selectedInvoice ? (
          <div className="invoice">
            <div className="invoice__header">
              <div className="invoice__hotel">AURUM HOTEL</div>
              <div className="invoice__addr">Galle Face Hotel Road<br />Colombo 003, Sri Lanka<br />Tel: +94 11 244 5555</div>
            </div>
            <div className="invoice__row"><span>Payment ID:</span><span>#{selectedInvoice.id}</span></div>
            <div className="invoice__row"><span>Reservation #:</span><span>{selectedInvoice.reservationId}</span></div>
            <div className="invoice__row"><span>Customer ID:</span><span>{selectedInvoice.customerId}</span></div>
            <div className="invoice__row"><span>Method:</span><span>{formatMethod(selectedInvoice)}</span></div>
            <div className="invoice__row"><span>Date:</span><span>{selectedInvoice.date}</span></div>
            <div className="invoice__row"><span>Status:</span><span>{selectedInvoice.status}</span></div>
            <div className="invoice__row invoice__row--total">
              <span>TOTAL:</span><span>LKR {selectedInvoice.amount.toLocaleString()}</span>
            </div>
            <div className="invoice__footer">Thank you for staying at Aurum · Ayubowan</div>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#999" }}>
            Select a payment from the history to view its invoice.
          </p>
        )
      )}
    </section>
  );
}
