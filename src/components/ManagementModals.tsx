import { useEffect, useState } from "react";

// ==========================================
// 1. INVOICE MODAL (Print-Ready, Premium View)
// ==========================================
interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoiceData: {
    id: string;
    guest: string;
    amount: string;
    method: string;
    status: "Paid" | "Pending" | "Refunded";
    date?: string;
  } | null;
}

export function InvoiceModal({ open, onClose, invoiceData }: InvoiceModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !invoiceData) return null;

  const invoiceDate = invoiceData.date || new Date().toLocaleDateString("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const parsedAmount = parseInt(invoiceData.amount.replace(/[^\d]/g, ""), 10) || 150000;
  const netAmount = Math.round(parsedAmount / 1.2); // 20% taxes/charges
  const vatAmount = Math.round(netAmount * 0.1); // 10% VAT
  const serviceCharge = Math.round(netAmount * 0.1); // 10% Service Charge

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      {/* Dynamic styling for clean physical/PDF printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-invoice-area, #print-invoice-area * {
            visibility: visible;
          }
          #print-invoice-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        id="print-invoice-area"
        className="relative w-full max-w-2xl bg-[#0F0F11] border border-gold-500/30 shadow-2xl shadow-black/80 animate-[scaleIn_0.25s_ease-out] text-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="no-print absolute top-4 right-4 z-10 w-10 h-10 text-gray-400 hover:text-gold-400 transition-colors flex items-center justify-center"
          aria-label="Close"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Invoice Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* Header Brand */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">🏆</span>
                <span className="font-display text-2xl tracking-[0.25em] text-white font-bold">AURUM</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-gold-400 font-semibold">Colombo Monolithic Luxury Suite</p>
              <p className="text-xs text-gray-400 mt-2">144 Galle Rd, Colombo 00300, Sri Lanka</p>
              <p className="text-xs text-gray-400">reservations@aurumhotel.lk | +94 11 234 5678</p>
            </div>
            <div className="sm:text-right">
              <h3 className="font-display text-2xl text-gold-400 font-bold uppercase tracking-wider">Invoice</h3>
              <div className="text-sm text-white font-semibold mt-1">#INV-{invoiceData.id.replace(/[^\d]/g, "") || "49382"}</div>
              <div className="text-xs text-gray-400 mt-1">Date: {invoiceDate}</div>
              <div className="inline-flex items-center px-3 py-1 text-[10px] uppercase tracking-wider border border-white/10 bg-white/5 mt-3 text-gold-400">
                {invoiceData.status}
              </div>
            </div>
          </div>

          {/* Client Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-white/10 pb-6 text-sm">
            <div>
              <span className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Billed To</span>
              <div className="font-semibold text-white">{invoiceData.guest}</div>
              <div className="text-gray-400 text-xs mt-1">Registered Guest ID: C-00{invoiceData.id.slice(-1)}</div>
              <div className="text-gray-400 text-xs">Email: {invoiceData.guest.toLowerCase().replace(/\s/g, "")}@example.lk</div>
            </div>
            <div className="sm:text-right">
              <span className="text-xs uppercase tracking-widest text-gray-500 block mb-1">Payment Method</span>
              <div className="font-semibold text-white">{invoiceData.method}</div>
              <div className="text-gray-400 text-xs mt-1">Processed: Visa / Gateway V3</div>
              <div className="text-gray-400 text-xs">Auth Code: AUTH-{Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-2">Billing Details</div>
            <div className="border border-white/10 bg-black/20 overflow-hidden">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th className="px-4 py-2.5 text-left uppercase tracking-wider text-gold-400 font-medium">Description</th>
                    <th className="px-4 py-2.5 text-center uppercase tracking-wider text-gold-400 font-medium">Stays</th>
                    <th className="px-4 py-2.5 text-right uppercase tracking-wider text-gold-400 font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-4 py-3 text-white">
                      <div className="font-medium">Luxury Suite Lodging (Dynamic Rate)</div>
                      <div className="text-[10px] text-gray-500">Premium view, custom guest priority privileges included</div>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-300">1 Night</td>
                    <td className="px-4 py-3 text-right text-white">LKR {netAmount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-white">
                      <div className="font-medium">Spa & Concierge Facilities Charge</div>
                      <div className="text-[10px] text-gray-500">Complimentary valet & wellness center package access</div>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-300">-</td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-medium">Included</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-72 space-y-2.5 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Room Charges Net</span>
                <span>LKR {netAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>VAT / Hotel Tax (10%)</span>
                <span>LKR {vatAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Local Service Surcharge (10%)</span>
                <span>LKR {serviceCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white font-semibold text-sm border-t border-white/10 pt-3.5">
                <span className="text-gold-400 uppercase tracking-widest text-[11px] font-bold">Total Amount Due</span>
                <span className="text-gold-400">{invoiceData.amount}</span>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="text-[10px] text-gray-500 text-center leading-relaxed border-t border-white/10 pt-6">
            Thank you for selecting Aurum Colombo Hotel. This is a computer-generated luxury invoice statement.<br />
            For details regarding custom cancellations or corporate business accounts, contact accounting@aurumhotel.lk.
          </div>
        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="no-print p-6 border-t border-white/10 bg-black/40 grid grid-cols-2 gap-4">
          <button
            onClick={handlePrint}
            className="w-full bg-gold-500 hover:bg-gold-400 text-black font-semibold py-3.5 uppercase tracking-widest text-xs transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0a2.25 2.25 0 01-2.25 2.25H8.59A2.25 2.25 0 016.34 18m11.32 0h.008V18h-.008zm-11.32 0h.008V18h-.008zM12 10.5v-4.5m0-1.5h.008v.008H12V4.5z" />
            </svg>
            Print Invoice
          </button>
          <button
            onClick={onClose}
            className="w-full bg-dark-400 hover:bg-dark-350 border border-white/10 text-gray-300 hover:text-white font-semibold py-3.5 uppercase tracking-widest text-xs transition-all duration-300"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. CUSTOMER PROFILE MODAL (VIP Stat Card & Notes Editor)
// ==========================================
interface CustomerProfileModalProps {
  open: boolean;
  onClose: () => void;
  customer: {
    id: string;
    name: string;
    tier: "Guest" | "VIP";
    email: string;
    stays: number;
    notes?: string;
  } | null;
  onSaveNotes: (id: string, notes: string) => void;
}

export function CustomerProfileModal({ open, onClose, customer, onSaveNotes }: CustomerProfileModalProps) {
  const [internalNotes, setInternalNotes] = useState("");

  useEffect(() => {
    if (customer) {
      // Look up note from localStorage or default
      const savedNotes = localStorage.getItem(`aurum-customer-note-${customer.id}`);
      setInternalNotes(savedNotes || customer.notes || "");
    }
  }, [customer]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !customer) return null;

  const handleSave = () => {
    localStorage.setItem(`aurum-customer-note-${customer.id}`, internalNotes);
    onSaveNotes(customer.id, internalNotes);
  };

  // Luxury simulated metrics
  const avgSuiteSpend = customer.tier === "VIP" ? 280000 : 150000;
  const totalLKRSpend = customer.stays * avgSuiteSpend;
  const loyaltyPoints = customer.stays * 150;
  const registrationDate = "Oct 12, 2025";

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0F0F11] border border-gold-500/30 shadow-2xl shadow-black/80 animate-[scaleIn_0.25s_ease-out] text-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 text-gray-400 hover:text-gold-400 transition-colors flex items-center justify-center"
          aria-label="Close"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Profile Details Header */}
        <div className="p-6 sm:p-8 pb-4 border-b border-white/10 bg-gradient-to-br from-gold-500/5 to-transparent">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center font-display font-bold text-4xl shadow-xl shrink-0 ${
              customer.tier === "VIP" 
                ? "bg-gradient-to-br from-gold-400 to-amber-500 text-black shadow-gold-500/20" 
                : "bg-white/10 text-white"
            }`}>
              {customer.name.charAt(0)}
            </div>
            <div className="text-center sm:text-left flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h3 className="font-display text-2xl font-bold text-white">{customer.name}</h3>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 border ${
                  customer.tier === "VIP" 
                    ? "border-amber-400/30 bg-amber-400/10 text-amber-400" 
                    : "border-gray-500/30 bg-gray-500/10 text-gray-400"
                }`}>
                  {customer.tier} Member
                </span>
              </div>
              <p className="text-sm text-gray-400">{customer.email}</p>
              <p className="text-xs text-gold-400 font-medium">Guest Registration: {registrationDate} (ID: {customer.id})</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 sm:px-8 border-b border-white/10 bg-black/20">
          <div className="bg-[#151518] border border-white/5 p-3.5">
            <span className="text-[9px] uppercase tracking-widest text-gray-500 block mb-1">Total Stays</span>
            <span className="text-2xl font-display font-bold text-gold-400">{customer.stays}</span>
          </div>
          <div className="bg-[#151518] border border-white/5 p-3.5">
            <span className="text-[9px] uppercase tracking-widest text-gray-500 block mb-1">Estimated Spending</span>
            <span className="text-lg font-display font-bold text-white">LKR {(totalLKRSpend/1000).toFixed(0)}k</span>
          </div>
          <div className="bg-[#151518] border border-white/5 p-3.5">
            <span className="text-[9px] uppercase tracking-widest text-gray-500 block mb-1">Loyalty Tier</span>
            <span className="text-lg font-display font-bold text-amber-400">{loyaltyPoints} PTS</span>
          </div>
          <div className="bg-[#151518] border border-white/5 p-3.5">
            <span className="text-[9px] uppercase tracking-widest text-gray-500 block mb-1">Avg stay length</span>
            <span className="text-sm font-display font-bold text-gray-300">2.5 Nights</span>
          </div>
        </div>

        {/* Notes area + Recent Bookings */}
        <div className="p-6 sm:p-8 space-y-5 overflow-y-auto">
          {/* Notes Area */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold">
              Internal Manager Notes & Custom Requirements
            </label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Add personalized VIP preferences, food allergies, room climate requests or special VIP attention remarks..."
              rows={4}
              className="w-full bg-[#131316] border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-gold-500 outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Simulated stay history */}
          <div className="space-y-3">
            <label className="block text-[10px] uppercase tracking-[0.25em] text-gray-400 font-semibold">
              Recent Stays History Log
            </label>
            <div className="border border-white/10 bg-black/10 rounded-sm divide-y divide-white/5 text-xs">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">Deluxe Ocean Suite #301</span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">Stay: Checked In (Today)</span>
                </div>
                <span className="text-emerald-400 font-medium">Active</span>
              </div>
              {customer.stays > 1 && (
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">Executive Panoramic Suite #201</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">Stay: Confirmed (15-18 Apr 2026)</span>
                  </div>
                  <span className="text-gold-400 font-medium">Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Foot Action Buttons */}
        <div className="p-6 border-t border-white/10 bg-black/40 grid grid-cols-2 gap-4">
          <button
            onClick={handleSave}
            className="w-full bg-gold-500 hover:bg-gold-400 text-black font-semibold py-3.5 uppercase tracking-widest text-xs transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 flex items-center justify-center gap-2"
          >
            Save Remarks
          </button>
          <button
            onClick={onClose}
            className="w-full bg-dark-400 hover:bg-dark-350 border border-white/10 text-gray-300 hover:text-white font-semibold py-3.5 uppercase tracking-widest text-xs transition-all duration-300"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. CUSTOMER MESSAGE MODAL (Realistic SMTP Console Simulator)
// ==========================================
interface CustomerMessageModalProps {
  open: boolean;
  onClose: () => void;
  customerName: string;
  customerEmail: string;
}

export function CustomerMessageModal({ open, onClose, customerName, customerEmail }: CustomerMessageModalProps) {
  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);
  const [sentLogs, setSentLogs] = useState<{ id: string; subject: string; date: string }[]>([]);

  useEffect(() => {
    if (open) {
      setSubject(`Exclusive VIP Welcome: Aurum Monolithic Suite`);
      setBodyText(`Dear ${customerName},\n\nWe are delighted to offer customized wellness upgrades and special dining options for your stay. Please contact the luxury concierge for room reservation modifications.\n\nBest Regards,\nAurum Concierge Team`);
      setDeliveryStatus(null);

      // Load previous logs
      const raw = localStorage.getItem(`aurum-sent-msg-${customerEmail}`);
      if (raw) {
        try { setSentLogs(JSON.parse(raw)); } catch {}
      } else {
        setSentLogs([]);
      }
    }
  }, [open, customerName, customerEmail]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !deliveryStatus) onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, deliveryStatus]);

  if (!open) return null;

  const handleSend = () => {
    // Step by step SMTP gateway simulation
    const steps = [
      { text: "Initializing secure TLS SMTP gateway connection...", delay: 0 },
      { text: "Authenticating mail credentials with port 587...", delay: 600 },
      { text: "Validating Aurum cryptographic DKIM signatures...", delay: 1200 },
      { text: "Delivering email package payload to target server...", delay: 1800 },
      { text: "Successfully delivered! Mail status code: 250 OK", delay: 2400 },
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setDeliveryStatus(step.text);
        if (step.delay === 2400) {
          // Finish up and log
          const newLog = {
            id: `MSG-${Date.now().toString().slice(-4)}`,
            subject,
            date: new Date().toLocaleTimeString("en-LK", { hour: '2-digit', minute: '2-digit' }),
          };
          const updatedLogs = [newLog, ...sentLogs];
          setSentLogs(updatedLogs);
          localStorage.setItem(`aurum-sent-msg-${customerEmail}`, JSON.stringify(updatedLogs));

          // Auto-close after 800ms
          setTimeout(() => {
            onClose();
          }, 800);
        }
      }, step.delay);
    });
  };

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-[fadeIn_0.2s_ease-out]"
      onClick={deliveryStatus ? undefined : onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#0F0F11] border border-gold-500/30 shadow-2xl shadow-black/80 animate-[scaleIn_0.25s_ease-out] text-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!deliveryStatus && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 text-gray-400 hover:text-gold-400 transition-colors flex items-center justify-center"
            aria-label="Close"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Delivery overlay during gateway simulation */}
        {deliveryStatus && (
          <div className="absolute inset-0 bg-[#0F0F11]/95 z-20 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
            <h4 className="font-display text-lg tracking-wider text-gold-400 font-bold uppercase">Transmitting Broadcast Message</h4>
            <p className="text-sm text-gray-300 font-mono text-center max-w-md bg-black/45 border border-white/5 p-3">{deliveryStatus}</p>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 border-b border-white/10 bg-gradient-to-br from-gold-500/5 to-transparent">
          <div className="text-[9px] uppercase tracking-[0.28em] text-gold-400 mb-2">SMTP BROADCAST CENTER</div>
          <h3 className="font-display text-2xl font-bold text-white">Message Guest</h3>
          <p className="text-xs text-gray-400 mt-1">Recipient: <span className="text-gold-400 font-medium">{customerName}</span> ({customerEmail})</p>
        </div>

        {/* Input Forms */}
        <div className="p-6 sm:p-8 space-y-5 overflow-y-auto max-h-[50vh]">
          {/* Subject Field */}
          <div className="space-y-2">
            <label className="block text-[9px] uppercase tracking-widest text-gray-400 font-semibold">Subject Title</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#131316] border border-white/10 px-4 py-3 text-sm text-white focus:border-gold-500 outline-none transition-colors"
            />
          </div>

          {/* Body Text Area */}
          <div className="space-y-2">
            <label className="block text-[9px] uppercase tracking-widest text-gray-400 font-semibold">Message Content</label>
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              rows={6}
              className="w-full bg-[#131316] border border-white/10 px-4 py-3 text-sm text-white focus:border-gold-500 outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Outbox log history */}
          {sentLogs.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="block text-[9px] uppercase tracking-widest text-gray-500 font-semibold">Previously Transmitted Today</label>
              <div className="space-y-1.5 font-mono text-[10px] text-gray-400">
                {sentLogs.map((log) => (
                  <div key={log.id} className="flex justify-between bg-black/15 p-2 border border-white/5">
                    <span className="truncate max-w-sm">✓ {log.subject}</span>
                    <span className="text-gray-500">{log.date} ({log.id})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions bar */}
        <div className="p-6 border-t border-white/10 bg-black/40 grid grid-cols-2 gap-4">
          <button
            onClick={handleSend}
            disabled={!subject || !bodyText}
            className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-35 disabled:hover:bg-gold-500 text-black font-semibold py-3.5 uppercase tracking-widest text-xs transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 flex items-center justify-center gap-2"
          >
            Transmit Message
          </button>
          <button
            onClick={onClose}
            className="w-full bg-dark-400 hover:bg-dark-350 border border-white/10 text-gray-300 hover:text-white font-semibold py-3.5 uppercase tracking-widest text-xs transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
