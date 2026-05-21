import { useEffect, useState } from "react";
import { useBooking } from "../context/BookingContext";
import { useToast } from "./Toast";

/**
 * Aurum Hotel — Full Booking Page
 *
 * 4-step booking experience:
 *   1. Stay  — dates, guests, rooms
 *   2. Room  — choose category (or use pre-filled selection)
 *   3. Extras — add-on services
 *   4. Guest + Payment summary
 *
 * Opens as a full-screen overlay when the user clicks "Book Now" anywhere.
 */

interface RoomOption {
  id: string;
  name: string;
  type: string;
  price: number;       // LKR/night
  image: string;
  capacity: string;
  features: string[];
}

interface AddOn {
  id: string;
  name: string;
  price: number;       // LKR (one-time or per-stay)
  description: string;
  icon: string;
}

const roomOptions: RoomOption[] = [
  {
    id: "deluxe",
    name: "Deluxe Room",
    type: "Standard Luxury",
    price: 150_000,
    image: "/images/deluxe-room.jpg",
    capacity: "2 Adults",
    features: ["King bed", "City view", "Marble bathroom", "Free Wi-Fi"],
  },
  {
    id: "executive",
    name: "Executive Suite",
    type: "Premium Suite",
    price: 280_000,
    image: "/images/executive-suite.jpg",
    capacity: "2 Adults + 1 Child",
    features: ["Living area", "Ocean view", "Butler service", "Lounge access"],
  },
  {
    id: "presidential",
    name: "Presidential Suite",
    type: "Ultra Luxury",
    price: 850_000,
    image: "/images/presidential-suite.jpg",
    capacity: "4 Adults",
    features: ["Private terrace", "Personal butler", "Jacuzzi", "Limousine"],
  },
];

const addOns: AddOn[] = [
  { id: "breakfast", name: "Breakfast Buffet",  price: 12_000, description: "Continental + Sri Lankan",  icon: "🍳" },
  { id: "airport",   name: "Airport Pickup",    price: 18_000, description: "BIA Colombo → Hotel",       icon: "🚗" },
  { id: "spa",       name: "Spa Welcome",       price: 35_000, description: "60 min relaxation massage", icon: "💆" },
  { id: "wine",      name: "Champagne Welcome", price: 25_000, description: "Bottle on arrival",         icon: "🍾" },
  { id: "wifi",      name: "Premium Wi-Fi",     price:  2_500, description: "Unlimited high-speed",      icon: "📶" },
  { id: "parking",   name: "Valet Parking",     price:  5_000, description: "24/7 secured parking",      icon: "🅿️" },
];

const STEPS = ["Your Stay", "Choose Room", "Add Extras", "Confirm"] as const;

export default function BookingPage() {
  const { isOpen, prefill, closeBooking } = useBooking();
  const { addToast } = useToast();

  const [step, setStep] = useState(0);

  // Step 1 — Stay details
  const [checkIn, setCheckIn]   = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests]     = useState(2);
  const [rooms, setRooms]       = useState(1);
  const [specialReq, setSpecialReq] = useState("");

  // Step 2 — Room
  const [roomId, setRoomId] = useState<string>("deluxe");

  // Step 3 — Add-ons (set of IDs)
  const [extras, setExtras] = useState<Set<string>>(new Set());

  // Step 4 — Guest + Payment
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("+94 ");
  const [country,   setCountry]   = useState("Sri Lanka");
  const [payMethod, setPayMethod] = useState<"card" | "cash" | "online">("card");
  const [cardName,  setCardName]  = useState("");
  const [cardNum,   setCardNum]   = useState("");
  const [cardExp,   setCardExp]   = useState("");
  const [cardCvv,   setCardCvv]   = useState("");
  const [agree,     setAgree]     = useState(false);

  // Handle pre-fill data when opening
  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    setExtras(new Set());
    setSpecialReq("");

    if (prefill.checkIn)  setCheckIn(prefill.checkIn);
    if (prefill.checkOut) setCheckOut(prefill.checkOut);
    if (prefill.guests)   setGuests(prefill.guests);
    if (prefill.rooms)    setRooms(prefill.rooms);

    // Map prefilled room to one of the options
    if (prefill.roomName) {
      const lower = prefill.roomName.toLowerCase();
      if (lower.includes("president")) setRoomId("presidential");
      else if (lower.includes("executive") || lower.includes("suite")) setRoomId("executive");
      else setRoomId("deluxe");
    }

    // Smart special-request prefill based on what button opened this page
    const requestLines = [
      prefill.purpose ? `Request type: ${prefill.purpose}` : "",
      prefill.packageName ? `Package/Menu/Event: ${prefill.packageName}` : "",
      prefill.serviceName ? `Requested service: ${prefill.serviceName}` : "",
      prefill.eventName ? `Event venue: ${prefill.eventName}` : "",
    ].filter(Boolean);

    if (requestLines.length > 0) {
      setSpecialReq(requestLines.join("\n"));
    }

    // Pre-select spa extra when a spa-related flow opens the page
    if (
      (prefill.serviceName && prefill.serviceName.toLowerCase().includes("spa")) ||
      (prefill.purpose && prefill.purpose.toLowerCase().includes("spa"))
    ) {
      setExtras(new Set(["spa"]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeBooking(); };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeBooking]);

  if (!isOpen) return null;

  // ============ Computed values ============
  const selectedRoom = roomOptions.find((r) => r.id === roomId)!;
  const nights = (() => {
    if (!checkIn || !checkOut) return 1;
    const ci = new Date(checkIn).getTime();
    const co = new Date(checkOut).getTime();
    const n = Math.max(1, Math.round((co - ci) / 86_400_000));
    return n;
  })();

  const roomTotal   = selectedRoom.price * nights * rooms;
  const extrasTotal = Array.from(extras).reduce(
    (sum, id) => sum + (addOns.find((a) => a.id === id)?.price ?? 0),
    0
  );
  const subtotal = roomTotal + extrasTotal;
  const tax      = subtotal * 0.18;          // 18 % VAT + service
  const total    = subtotal + tax;

  // ============ Step navigation ============
  const canProceed = (() => {
    if (step === 0) return checkIn && checkOut && nights > 0;
    if (step === 1) return Boolean(roomId);
    if (step === 3)
      return firstName && lastName && email && phone && agree
          && (payMethod !== "card" || (cardName && cardNum.length >= 16 && cardExp && cardCvv.length === 3));
    return true;
  })();

  const next = () => {
    if (!canProceed) {
      addToast("Please fill in all required fields", "info");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const toggleExtra = (id: string) => {
    setExtras((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleConfirm = () => {
    if (!canProceed) {
      addToast("Please complete all fields", "info");
      return;
    }
    addToast(
      `🎉 Booking confirmed! Reference #AUR-${Date.now().toString().slice(-6)}. Confirmation sent to ${email}.`,
      "success"
    );
    setTimeout(closeBooking, 1500);
  };

  const formatLKR = (n: number) =>
    `LKR ${n.toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;

  // ============ Render ============
  return (
    <div className="fixed inset-0 z-[200] bg-dark-500/98 backdrop-blur-sm overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
      <div className="min-h-screen flex flex-col">
        {/* === HEADER === */}
        <header className="sticky top-0 z-10 bg-black/95 backdrop-blur-md border-b border-gold-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-gold-400 flex items-center justify-center">
                <span className="text-gold-400 font-display text-xl font-bold">A</span>
              </div>
              <div>
                <div className="font-display text-xl text-white font-bold tracking-wider">AURUM</div>
                <div className="text-xs uppercase tracking-widest text-gold-400">Reservation</div>
              </div>
            </div>

            <button
              onClick={closeBooking}
              className="w-11 h-11 rounded-full border border-white/20 hover:bg-gold-500 hover:border-gold-500 hover:text-black text-white flex items-center justify-center transition-all duration-300"
              aria-label="Close booking"
              title="Close (Esc)"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Step indicator */}
          <div className="border-t border-white/5">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between gap-2">
                {STEPS.map((label, i) => {
                  const done   = i < step;
                  const active = i === step;
                  return (
                    <div key={label} className="flex items-center flex-1 gap-3">
                      <div
                        className={`relative shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          active
                            ? "bg-gold-500 text-black ring-4 ring-gold-500/20 scale-110"
                            : done
                              ? "bg-gold-500/20 text-gold-400 border border-gold-500/40"
                              : "bg-white/5 text-gray-500 border border-white/10"
                        }`}
                      >
                        {done ? (
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </div>
                      <div className={`text-xs sm:text-sm uppercase tracking-widest font-medium hidden sm:block ${
                        active ? "text-gold-400" : done ? "text-gray-300" : "text-gray-600"
                      }`}>
                        {label}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`flex-1 h-[1px] ${done ? "bg-gold-500/40" : "bg-white/10"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        {/* === BODY: 2-column layout === */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-[1fr_400px] gap-8">
          {/* === LEFT: Step content === */}
          <div className="space-y-6">

            {/* ---------- STEP 1: Your Stay ---------- */}
            {step === 0 && (
              <section className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
                <div>
                  <h2 className="font-display text-3xl text-white font-bold mb-2">
                    {prefill.purpose ? "Your Reservation Request" : "Your Stay"}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {prefill.purpose
                      ? "We’ve prefilled your request details below. Complete the reservation and our concierge team will follow up."
                      : "When are you planning to visit Aurum, Colombo?"}
                  </p>
                </div>

                {(prefill.purpose || prefill.packageName || prefill.serviceName || prefill.eventName) && (
                  <div className="bg-gold-500/10 border border-gold-500/30 rounded-sm p-5">
                    <div className="text-xs uppercase tracking-widest text-gold-400 mb-3 font-semibold">
                      Request Summary
                    </div>
                    <div className="space-y-2 text-sm">
                      {prefill.purpose && (
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-400">Purpose</span>
                          <span className="text-white font-medium text-right">{prefill.purpose}</span>
                        </div>
                      )}
                      {prefill.packageName && (
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-400">Selection</span>
                          <span className="text-white font-medium text-right">{prefill.packageName}</span>
                        </div>
                      )}
                      {prefill.serviceName && (
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-400">Service</span>
                          <span className="text-white font-medium text-right">{prefill.serviceName}</span>
                        </div>
                      )}
                      {prefill.eventName && (
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-400">Event Venue</span>
                          <span className="text-white font-medium text-right">{prefill.eventName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-dark-300 border border-white/10 rounded-sm p-6 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Check-in *">
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().slice(0, 10)}
                        className="w-full bg-dark-400 border border-gray-700 px-4 py-3.5 text-white focus:border-gold-500 outline-none transition-all rounded-sm"
                      />
                    </Field>
                    <Field label="Check-out *">
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().slice(0, 10)}
                        className="w-full bg-dark-400 border border-gray-700 px-4 py-3.5 text-white focus:border-gold-500 outline-none transition-all rounded-sm"
                      />
                    </Field>
                  </div>

                  {checkIn && checkOut && (
                    <div className="bg-gold-500/10 border border-gold-500/30 px-4 py-3 text-sm text-gold-400 rounded-sm">
                      ✨ Total nights: <strong>{nights}</strong>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Guests">
                      <Counter value={guests} setValue={setGuests} min={1} max={8} suffix={guests === 1 ? "Guest" : "Guests"} />
                    </Field>
                    <Field label="Rooms">
                      <Counter value={rooms} setValue={setRooms} min={1} max={5} suffix={rooms === 1 ? "Room" : "Rooms"} />
                    </Field>
                  </div>

                  <Field label="Special requests (optional)">
                    <textarea
                      rows={3}
                      value={specialReq}
                      onChange={(e) => setSpecialReq(e.target.value)}
                      placeholder="Allergies, celebrations, accessibility needs…"
                      className="w-full bg-dark-400 border border-gray-700 px-4 py-3 text-white focus:border-gold-500 outline-none transition-all rounded-sm resize-none placeholder-gray-600"
                    />
                  </Field>
                </div>
              </section>
            )}

            {/* ---------- STEP 2: Choose Room ---------- */}
            {step === 1 && (
              <section className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
                <div>
                  <h2 className="font-display text-3xl text-white font-bold mb-2">Choose Your Room</h2>
                  <p className="text-gray-400 text-sm">Each suite is hand-crafted for an unforgettable stay.</p>
                </div>

                <div className="space-y-4">
                  {roomOptions.map((r) => {
                    const selected = r.id === roomId;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setRoomId(r.id)}
                        className={`w-full text-left bg-dark-300 border-2 transition-all duration-300 rounded-sm overflow-hidden grid sm:grid-cols-[200px_1fr] ${
                          selected
                            ? "border-gold-500 shadow-lg shadow-gold-500/20"
                            : "border-white/10 hover:border-gold-500/50"
                        }`}
                      >
                        <div
                          className="h-48 sm:h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${r.image})` }}
                        />
                        <div className="p-5 flex flex-col">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-xs uppercase tracking-widest text-gold-400 mb-1">{r.type}</div>
                              <h3 className="font-display text-2xl text-white font-bold">{r.name}</h3>
                              <div className="text-sm text-gray-400 mt-1">👥 {r.capacity}</div>
                            </div>
                            {selected && (
                              <div className="w-7 h-7 rounded-full bg-gold-500 text-black flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 my-3">
                            {r.features.map((f) => (
                              <span key={f} className="text-xs px-2 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-sm">
                                {f}
                              </span>
                            ))}
                          </div>
                          <div className="mt-auto flex items-baseline gap-2">
                            <span className="font-display text-2xl text-gold-400 font-bold">{formatLKR(r.price)}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest">/ night</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ---------- STEP 3: Add Extras ---------- */}
            {step === 2 && (
              <section className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
                <div>
                  <h2 className="font-display text-3xl text-white font-bold mb-2">Personalise Your Stay</h2>
                  <p className="text-gray-400 text-sm">Optional add-ons to make your visit truly memorable.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {addOns.map((a) => {
                    const selected = extras.has(a.id);
                    return (
                      <button
                        key={a.id}
                        onClick={() => toggleExtra(a.id)}
                        className={`text-left bg-dark-300 border-2 p-5 rounded-sm transition-all duration-300 ${
                          selected
                            ? "border-gold-500 shadow-lg shadow-gold-500/10"
                            : "border-white/10 hover:border-gold-500/50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-3xl">{a.icon}</div>
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                            selected
                              ? "bg-gold-500 border-gold-500 text-black"
                              : "border-gray-600"
                          }`}>
                            {selected && (
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <h4 className="font-display text-lg text-white font-bold">{a.name}</h4>
                        <p className="text-sm text-gray-400 mb-2">{a.description}</p>
                        <div className="text-gold-400 font-semibold text-sm">+ {formatLKR(a.price)}</div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ---------- STEP 4: Confirm ---------- */}
            {step === 3 && (
              <section className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
                <div>
                  <h2 className="font-display text-3xl text-white font-bold mb-2">Guest & Payment</h2>
                  <p className="text-gray-400 text-sm">Almost done — please confirm your details.</p>
                </div>

                {/* Guest info */}
                <div className="bg-dark-300 border border-white/10 rounded-sm p-6 space-y-5">
                  <h3 className="font-display text-lg text-gold-400 font-bold">Guest information</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="First name *">
                      <Input value={firstName} onChange={setFirstName} placeholder="John" />
                    </Field>
                    <Field label="Last name *">
                      <Input value={lastName} onChange={setLastName} placeholder="Doe" />
                    </Field>
                    <Field label="Email *">
                      <Input type="email" value={email} onChange={setEmail} placeholder="you@email.com" />
                    </Field>
                    <Field label="Phone *">
                      <Input type="tel" value={phone} onChange={setPhone} placeholder="+94 77 123 4567" />
                    </Field>
                    <Field label="Country">
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-dark-400 border border-gray-700 px-4 py-3.5 text-white focus:border-gold-500 outline-none transition-all rounded-sm"
                      >
                        {["Sri Lanka","India","United States","United Kingdom","Australia","UAE","Singapore","Other"].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>

                {/* Payment method */}
                <div className="bg-dark-300 border border-white/10 rounded-sm p-6 space-y-5">
                  <h3 className="font-display text-lg text-gold-400 font-bold">Payment method</h3>

                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { id: "card",   label: "Credit Card", icon: "💳" },
                      { id: "cash",   label: "Pay at Hotel", icon: "🏨" },
                      { id: "online", label: "Bank Transfer", icon: "🏦" },
                    ] as const).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setPayMethod(m.id)}
                        className={`p-4 border-2 rounded-sm text-center transition-all ${
                          payMethod === m.id
                            ? "border-gold-500 bg-gold-500/10"
                            : "border-white/10 hover:border-gold-500/50"
                        }`}
                      >
                        <div className="text-2xl mb-1">{m.icon}</div>
                        <div className="text-xs uppercase tracking-widest text-white font-semibold">{m.label}</div>
                      </button>
                    ))}
                  </div>

                  {payMethod === "card" && (
                    <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                      <Field label="Cardholder name *">
                        <Input value={cardName} onChange={setCardName} placeholder="JOHN DOE" />
                      </Field>
                      <Field label="Card number *">
                        <Input
                          value={cardNum}
                          onChange={(v) => setCardNum(v.replace(/\D/g, "").slice(0, 16))}
                          placeholder="1234 5678 9012 3456"
                        />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Expiry *">
                          <Input value={cardExp} onChange={setCardExp} placeholder="MM/YY" />
                        </Field>
                        <Field label="CVV *">
                          <Input
                            value={cardCvv}
                            onChange={(v) => setCardCvv(v.replace(/\D/g, "").slice(0, 3))}
                            placeholder="123"
                          />
                        </Field>
                      </div>
                    </div>
                  )}

                  {payMethod === "cash" && (
                    <div className="bg-blue-500/10 border border-blue-500/30 px-4 py-3 text-sm text-blue-300 rounded-sm">
                      ℹ️ A 10% deposit will be required at check-in to secure your reservation.
                    </div>
                  )}

                  {payMethod === "online" && (
                    <div className="bg-blue-500/10 border border-blue-500/30 px-4 py-3 text-sm text-blue-300 rounded-sm">
                      ℹ️ Bank transfer details will be sent to your email after confirmation.
                    </div>
                  )}
                </div>

                {/* Agree */}
                <label className="flex items-start gap-3 text-sm text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-1 accent-gold-500 w-4 h-4 cursor-pointer"
                  />
                  <span>
                    I agree to the <span className="text-gold-400 underline">Booking Terms</span>,{" "}
                    <span className="text-gold-400 underline">Privacy Policy</span> and{" "}
                    <span className="text-gold-400 underline">Cancellation Policy</span> of Aurum Hotel.
                  </span>
                </label>
              </section>
            )}

            {/* === Step nav buttons === */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {step > 0 && (
                <button
                  onClick={back}
                  className="px-8 py-4 border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 uppercase tracking-widest text-sm font-semibold transition-all duration-300 rounded-sm"
                >
                  ← Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button
                  onClick={next}
                  disabled={!canProceed}
                  className="flex-1 group inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 text-black font-semibold px-8 py-4 uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-0.5 rounded-sm"
                >
                  Continue
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  disabled={!canProceed}
                  className="flex-1 group inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 text-black font-semibold px-8 py-4 uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-0.5 rounded-sm"
                >
                  ✨ Confirm & Pay {formatLKR(total)}
                </button>
              )}
            </div>
          </div>

          {/* === RIGHT: Live booking summary === */}
          <aside className="lg:sticky lg:top-44 lg:self-start space-y-4">
            <div className="bg-gradient-to-br from-dark-300 to-dark-400 border border-gold-500/30 rounded-sm overflow-hidden shadow-2xl">
              {/* Room image header */}
              <div
                className="h-40 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${selectedRoom.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="text-xs uppercase tracking-widest text-gold-400">{selectedRoom.type}</div>
                  <div className="font-display text-xl text-white font-bold">{selectedRoom.name}</div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <h3 className="font-display text-lg text-gold-400 font-bold flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Your booking
                </h3>

                <div className="text-sm space-y-2 text-gray-300">
                  {prefill.purpose && <Row label="Request type" value={prefill.purpose} />}
                  {prefill.packageName && <Row label="Selection" value={prefill.packageName} />}
                  {prefill.serviceName && <Row label="Service" value={prefill.serviceName} />}
                  {prefill.eventName && <Row label="Event" value={prefill.eventName} />}
                  <Row label="Check-in"  value={checkIn || "—"} />
                  <Row label="Check-out" value={checkOut || "—"} />
                  <Row label="Nights"    value={String(nights)} />
                  <Row label="Guests"    value={`${guests} · ${rooms} room${rooms > 1 ? "s" : ""}`} />
                </div>

                <hr className="border-white/10" />

                <div className="text-sm space-y-2">
                  <Row label={`${selectedRoom.name} × ${nights}`} value={formatLKR(roomTotal)} />
                  {extras.size > 0 && (
                    <Row label={`Add-ons (${extras.size})`} value={formatLKR(extrasTotal)} />
                  )}
                  <Row label="Subtotal" value={formatLKR(subtotal)} />
                  <Row label="Tax & service (18%)" value={formatLKR(tax)} muted />
                </div>

                <hr className="border-gold-500/30" />

                <div className="flex items-baseline justify-between">
                  <span className="text-sm uppercase tracking-widest text-white">Total</span>
                  <span className="font-display text-2xl text-gold-400 font-bold">{formatLKR(total)}</span>
                </div>

                <div className="text-xs text-gray-500 italic">
                  Best-rate guarantee · Free cancellation up to 48h
                </div>
              </div>
            </div>

            {/* Help card */}
            <div className="bg-dark-300 border border-white/10 rounded-sm p-4 text-sm">
              <div className="flex items-center gap-2 text-gold-400 font-semibold mb-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                Need help?
              </div>
              <a href="tel:+94112445555" className="text-white hover:text-gold-400 block">+94 11 244 5555</a>
              <a href="mailto:concierge@aurumhotel.lk" className="text-gray-400 hover:text-gold-400 text-xs">concierge@aurumhotel.lk</a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ============ Small helpers ============

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input(props: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={props.type ?? "text"}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      placeholder={props.placeholder}
      className="w-full bg-dark-400 border border-gray-700 px-4 py-3.5 text-white placeholder-gray-600 focus:border-gold-500 outline-none transition-all rounded-sm"
    />
  );
}

function Counter({
  value, setValue, min, max, suffix,
}: {
  value: number;
  setValue: (n: number) => void;
  min: number;
  max: number;
  suffix: string;
}) {
  return (
    <div className="flex items-center justify-between bg-dark-400 border border-gray-700 px-3 py-2.5 rounded-sm">
      <button
        onClick={() => setValue(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-full border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-black transition-all"
        aria-label="Decrease"
      >−</button>
      <span className="text-white font-medium">{value} {suffix}</span>
      <button
        onClick={() => setValue(Math.min(max, value + 1))}
        className="w-8 h-8 rounded-full border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-black transition-all"
        aria-label="Increase"
      >+</button>
    </div>
  );
}

function Row({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between gap-2">
      <span className={muted ? "text-gray-500" : "text-gray-400"}>{label}</span>
      <span className={`font-medium ${muted ? "text-gray-500" : "text-white"}`}>{value}</span>
    </div>
  );
}
