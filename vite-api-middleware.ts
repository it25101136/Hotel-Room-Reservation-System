import fs from "fs";
import path from "path";
import type { IncomingMessage, ServerResponse } from "http";

const DATA_DIR = path.resolve(process.cwd(), "backend/data");

// Map filenames to their member-specific module directories to maintain system-wide integrity
const MEMBER_PATHS: Record<string, string> = {
  "rooms.txt": "members/member-1-room-management/backend/data/rooms.txt",
  "reservations.txt": "members/member-2-reservation-management/backend/data/reservations.txt",
  "customers.txt": "members/member-3-customer-management/backend/data/customers.txt",
  "payments.txt": "members/member-4-payment-management/backend/data/payments.txt",
  "admins.txt": "members/member-5-admin-review-management/backend/data/admins.txt",
  "reviews.txt": "members/member-5-admin-review-management/backend/data/reviews.txt",
  "customer_services.txt": "members/member-6-service-management/backend/data/customer_services.txt",
  "services.txt": "members/member-6-service-management/backend/data/services.txt",
};

// Helper to ensure data directory and default .txt files exist with structured records
export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const seeds: Record<string, string> = {
    "admins.txt": [
      "1|admin|admin123|System Administrator|admin@aurumhotel.lk|+94 11 244 5555|FULL",
      "2|room|room123|Rooms Manager|room@aurumhotel.lk|+94 11 244 5555|ROOMS",
      "3|reservation|Reservation123|Reservations Manager|reservation@aurumhotel.lk|+94 11 244 5555|RESERVATIONS",
      "4|customer|Customer123|Customers Manager|customer@aurumhotel.lk|+94 11 244 5555|CUSTOMERS",
      "5|payment|Payment123|Payments Manager|payment@aurumhotel.lk|+94 11 244 5555|PAYMENTS",
      "6|reviews|Reviews123|Reviews Manager|reviews@aurumhotel.lk|+94 11 244 5555|REVIEWS",
      "7|facilities|Facilities123|Services Manager|facilities@aurumhotel.lk|+94 11 244 5555|SERVICES"
    ].join("\n") + "\n",
    "customers.txt": [
      "1|guest|guest123|Aurum Guest|guest@aurumhotel.lk|+94 11 244 5555|Galle Face, Colombo|REGULAR",
      "2|vip|vip123|Aurum VIP|vip@aurumhotel.lk|+94 11 244 5555|Galle Face, Colombo|VIP",
      "3|nimali|nimali123|Nimali Silva|nimali@aurum.lk|+94 77 123 4567|Flower Road, Colombo|VIP",
      "4|amal|amal123|Amal Perera|amal@aurum.lk|+94 77 987 6543|Kandy Road, Colombo|REGULAR"
    ].join("\n") + "\n",
    "rooms.txt": [
      "101|deluxe|150000|false|Elegant Deluxe Room with city view",
      "102|deluxe|150000|true|Elegant Deluxe Room with garden view",
      "201|suite|280000|false|Executive Suite with separate living area",
      "202|suite|280000|true|Executive Suite with butler service",
      "301|suite|850000|false|Presidential Suite with private terrace",
      "1|standard|75000|true|Standard Room with all basic amenities"
    ].join("\n") + "\n",
    "reservations.txt": [
      "2048|3|301|2026-05-16|2026-05-18|CONFIRMED|1700000|ONLINE",
      "2051|4|102|2026-05-15|2026-05-17|CHECKED_IN|300000|ONLINE",
      "2054|1|201|2026-05-19|2026-05-21|PENDING|560000|ONLINE",
      "2057|2|101|2026-05-22|2026-05-24|CANCELLED|300000|ONLINE"
    ].join("\n") + "\n",
    "payments.txt": [
      "9001|2048|3|1700000|PAID|2026-05-16|CARD-1234",
      "9002|2051|4|300000|PENDING|2026-05-15|CASH",
      "9003|2054|1|560000|PAID|2026-05-19|ONLINE-BOC",
      "9004|2057|2|300000|REFUNDED|2026-05-22|CARD-4321"
    ].join("\n") + "\n",
    "reviews.txt": [
      "1|3|301|5|Exceptional Suite|Exceptional suite, impeccable service.|2026-05-16|true|VERIFIED|2048",
      "2|4|102|4|Very Elegant Stay|Very elegant stay, breakfast was excellent.|2026-05-15|false|PUBLIC",
      "3|1|201|3|Delayed Prep|Service was good, but room prep was delayed.|2026-05-19|false|PUBLIC"
    ].join("\n") + "\n",
    "services.txt": [
      "1|Royal Gold Facial|105000|true|90 min luxury facial|SPA|PREMIUM",
      "2|Deep Tissue Massage|72000|true|60 min therapeutic massage|SPA|PREMIUM",
      "3|Aromatherapy Journey|92000|true|75 min aromatherapy|SPA|PREMIUM",
      "4|Hot Stone Therapy|115000|true|90 min hot stone therapy|SPA|PREMIUM",
      "5|Wi-Fi (Premium)|2500|true|High-speed unlimited Wi-Fi|ROOM|BASIC",
      "6|Breakfast Buffet|12000|true|Continental + Sri Lankan|DINING|BASIC",
      "7|Airport Pickup|18000|true|BIA Colombo → Hotel|TRANSPORT|BASIC",
      "8|Valet Parking|5000|true|24/7 secured parking|TRANSPORT|BASIC"
    ].join("\n") + "\n",
    "customer_services.txt": [
      "1|3|2048|1|1|105000|REQUESTED",
      "2|4|2051|6|1|12000|REQUESTED"
    ].join("\n") + "\n"
  };

  for (const [filename, content] of Object.entries(seeds)) {
    const filepath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filepath) || fs.readFileSync(filepath, "utf-8").trim() === "") {
      fs.writeFileSync(filepath, content, "utf-8");
    }

    // Mirror seed to respective member-specific database directories
    const memberRelativePath = MEMBER_PATHS[filename];
    if (memberRelativePath) {
      const memberFullpath = path.resolve(process.cwd(), memberRelativePath);
      const memberDir = path.dirname(memberFullpath);
      if (!fs.existsSync(memberDir)) {
        fs.mkdirSync(memberDir, { recursive: true });
      }
      if (!fs.existsSync(memberFullpath) || fs.readFileSync(memberFullpath, "utf-8").trim() === "") {
        fs.writeFileSync(memberFullpath, content, "utf-8");
      }
    }
  }
}

// Read lines from a file
function readLines(filename: string): string[] {
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) return [];
  return fs
    .readFileSync(filepath, "utf-8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

// Write lines to both central and member data folders simultaneously for absolute database synchronization
function writeLines(filename: string, lines: string[]) {
  const fileContent = lines.join("\n") + "\n";

  // 1. Write to central database package
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, fileContent, "utf-8");

  // 2. Mirror write operation to member's module package
  const memberRelativePath = MEMBER_PATHS[filename];
  if (memberRelativePath) {
    const memberFullpath = path.resolve(process.cwd(), memberRelativePath);
    const memberDir = path.dirname(memberFullpath);
    if (!fs.existsSync(memberDir)) {
      fs.mkdirSync(memberDir, { recursive: true });
    }
    fs.writeFileSync(memberFullpath, fileContent, "utf-8");
  }
}

// Load and parse all .txt files into JSON structure for the website
function loadDatabaseJSON() {
  ensureDataDir();

  // Load admins and customers
  const adminLines = readLines("admins.txt");
  const customerLines = readLines("customers.txt");
  const roomLines = readLines("rooms.txt");
  const reservationLines = readLines("reservations.txt");
  const paymentLines = readLines("payments.txt");
  const reviewLines = readLines("reviews.txt");
  const serviceLines = readLines("services.txt");
  const requestLines = readLines("customer_services.txt");

  // Map customers for reference lookups
  const customerMap: Record<number, { name: string; email: string }> = {};
  const customerList: any[] = [];
  customerLines.forEach((line) => {
    const p = line.split("|");
    if (p.length >= 8) {
      const id = parseInt(p[0], 10);
      const name = p[3];
      const email = p[4];
      customerMap[id] = { name, email };
      customerList.push({
        id: `C-${p[0].padStart(3, "0")}`,
        name,
        tier: p[7] === "VIP" ? "VIP" : "Guest",
        email,
        stays: 1 // default, will increment based on reservation history below
      });
    }
  });

  // Map users for AuthContext
  const authUsers: any[] = [];
  adminLines.forEach((line) => {
    const p = line.split("|");
    if (p.length >= 7) {
      let role = "admin";
      const perm = p[6].toUpperCase();
      if (perm !== "FULL") {
        role = perm.toLowerCase() + "-manager";
      }
      authUsers.push({
        id: p[0],
        name: p[3],
        email: p[4],
        password: p[2],
        role: role
      });
    }
  });

  customerLines.forEach((line) => {
    const p = line.split("|");
    if (p.length >= 8) {
      authUsers.push({
        id: p[0],
        name: p[3],
        email: p[4],
        password: p[2],
        role: p[7] === "VIP" ? "vip" : "guest"
      });
    }
  });

  // Parse rooms
  const rooms = roomLines.map((line) => {
    const p = line.split("|");
    const id = parseInt(p[0], 10);
    const typeLabel = p[1] === "deluxe" ? "Deluxe Room" : p[1] === "suite" ? (id === 301 ? "Presidential Suite" : "Executive Suite") : "Standard Room";
    const isAvail = p[3] === "true";
    let status: "Available" | "Occupied" | "Maintenance" = isAvail ? "Available" : "Occupied";
    if (!isAvail && id === 301) status = "Maintenance";

    return {
      id,
      type: typeLabel,
      price: `LKR ${parseInt(p[2], 10).toLocaleString()}`,
      status,
      view: p[4] || "City View"
    };
  });

  // Parse reservations
  const reservations = reservationLines.map((line) => {
    const p = line.split("|");
    const id = parseInt(p[0], 10);
    const custId = parseInt(p[1], 10);
    const roomNo = p[2];
    const checkIn = p[3];
    const checkOut = p[4];
    const statusLabel = p[5] === "CHECKED_IN" ? "Checked In" : p[5] === "CANCELLED" ? "Cancelled" : p[5] === "PENDING" ? "Pending" : "Confirmed";

    const cust = customerMap[custId] || { name: "Aurum Guest", email: "" };

    // Update guest stay count dynamically based on confirmed/checked in reservations
    const matchedCustomer = customerList.find(c => c.email.toLowerCase() === cust.email.toLowerCase());
    if (matchedCustomer && (statusLabel === "Confirmed" || statusLabel === "Checked In")) {
      matchedCustomer.stays += 1;
    }

    return {
      id: `R-${id}`,
      guest: cust.name,
      room: roomNo,
      checkIn,
      checkOut,
      status: statusLabel
    };
  });

  // Parse payments
  const payments = paymentLines.map((line) => {
    const p = line.split("|");
    const custId = parseInt(p[2], 10);
    const cust = customerMap[custId] || { name: "Aurum Guest", email: "" };
    const methodStr = p[6];
    let method = "Card";
    if (methodStr === "CASH") method = "Pay at Hotel";
    else if (methodStr.startsWith("ONLINE")) method = "Bank Transfer";

    const statusLabel = p[4] === "PAID" ? "Paid" : p[4] === "REFUNDED" ? "Refunded" : "Pending";

    return {
      id: `P-${p[0]}`,
      guest: cust.name,
      amount: `LKR ${parseInt(p[3], 10).toLocaleString()}`,
      method,
      status: statusLabel
    };
  });

  // Parse reviews
  const reviews = reviewLines.map((line) => {
    const p = line.split("|");
    const custId = parseInt(p[1], 10);
    const cust = customerMap[custId] || { name: "Aurum Guest", email: "" };
    const isApproved = p[7] === "true";

    return {
      id: `RV-${p[0].padStart(2, "0")}`,
      guest: cust.name,
      rating: parseInt(p[3], 10),
      room: p[2],
      status: isApproved ? ("Approved" as const) : ("Pending" as const),
      comment: `${p[4]}: ${p[5]}`
    };
  });

  // Parse services
  const services = serviceLines.map((line) => {
    const p = line.split("|");
    const id = p[0];
    const name = p[1];
    const isAvail = p[3] === "true";

    // Count how many requests there are for this service ID
    const serviceReqCount = requestLines.filter((reqLine) => {
      const parts = reqLine.split("|");
      return parts.length >= 4 && parts[3] === id;
    }).length;

    return {
      id: `S-${id.padStart(2, "0")}`,
      name,
      category: p[5].charAt(0).toUpperCase() + p[5].slice(1).toLowerCase(),
      status: isAvail ? ("Available" as const) : ("Busy" as const),
      requests: serviceReqCount + 3 // add some defaults for premium looks
    };
  });

  return {
    rooms,
    reservations,
    customers: customerList,
    payments,
    reviews,
    services,
    authUsers
  };
}

// Convert JSON lists from React back to the format expected by .txt files
function saveDatabaseJSON(data: any) {
  ensureDataDir();

  // 1. Save Customers
  if (data.customers) {
    const customerLines = data.customers.map((c: any, index: number) => {
      const id = c.id.replace("C-", "").replace(/^0+/, "") || String(index + 1);
      const username = c.name.toLowerCase().replace(/\s+/g, "");
      const email = c.email;
      const type = c.tier === "VIP" ? "VIP" : "REGULAR";
      // Find matching password from existing or default to username123
      const existingUser = (data.authUsers || []).find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      const password = existingUser ? existingUser.password : `${username}123`;
      return `${id}|${username}|${password}|${c.name}|${email}|+94 11 244 5555|Galle Face, Colombo|${type}`;
    });
    writeLines("customers.txt", customerLines);
  }

  // 2. Save Admins
  if (data.authUsers) {
    const adminLines: string[] = [];
    const customerLinesExtra: string[] = []; // double-check if guests are added here

    data.authUsers.forEach((u: any, index: number) => {
      if (u.role === "admin" || u.role.endsWith("-manager")) {
        const id = u.id || String(index + 1);
        let perm = "FULL";
        if (u.role !== "admin") {
          perm = u.role.replace("-manager", "").toUpperCase();
        }
        adminLines.push(`${id}|${u.name.toLowerCase().replace(/\s+/g, "")}|${u.password}|${u.name}|${u.email}|+94 11 244 5555|${perm}`);
      }
    });
    writeLines("admins.txt", adminLines);
  }

  // 3. Save Rooms
  if (data.rooms) {
    const roomLines = data.rooms.map((r: any) => {
      const type = r.type.toLowerCase().includes("deluxe") ? "deluxe" : r.type.toLowerCase().includes("suite") ? "suite" : "standard";
      const price = r.price.replace(/[^\d]/g, "");
      const avail = r.status === "Available" ? "true" : "false";
      return `${r.id}|${type}|${price}|${avail}|${r.view}`;
    });
    writeLines("rooms.txt", roomLines);
  }

  // 4. Save Reservations
  if (data.reservations) {
    const reservationLines = data.reservations.map((r: any) => {
      const id = r.id.replace("R-", "");
      // Map guest name back to customer ID
      const customerLines = readLines("customers.txt");
      let customerId = "1";
      for (const line of customerLines) {
        const p = line.split("|");
        if (p.length >= 4 && p[3].toLowerCase() === r.guest.toLowerCase()) {
          customerId = p[0];
          break;
        }
      }
      const status = r.status === "Checked In" ? "CHECKED_IN" : r.status === "Cancelled" ? "CANCELLED" : r.status === "Pending" ? "PENDING" : "CONFIRMED";
      // Find room price to compute total
      const roomNo = r.room;
      const roomLines = readLines("rooms.txt");
      let price = 150000;
      for (const line of roomLines) {
        const p = line.split("|");
        if (p[0] === roomNo) {
          price = parseFloat(p[2]) || 150000;
          break;
        }
      }
      const date1 = new Date(r.checkIn);
      const date2 = new Date(r.checkOut);
      const nights = Math.max(1, Math.round((date2.getTime() - date1.getTime()) / 86400000)) || 1;
      const total = price * nights;

      return `${id}|${customerId}|${roomNo}|${r.checkIn}|${r.checkOut}|${status}|${total}|ONLINE`;
    });
    writeLines("reservations.txt", reservationLines);
  }

  // 5. Save Payments
  if (data.payments) {
    const paymentLines = data.payments.map((p: any) => {
      const id = p.id.replace("P-", "");
      // Find customer ID by matching guest name
      const customerLines = readLines("customers.txt");
      let customerId = "1";
      for (const line of customerLines) {
        const pLine = line.split("|");
        if (pLine.length >= 4 && pLine[3].toLowerCase() === p.guest.toLowerCase()) {
          customerId = pLine[0];
          break;
        }
      }
      // Find matching reservation
      const resLines = readLines("reservations.txt");
      let resId = "2048";
      for (const line of resLines) {
        const parts = line.split("|");
        if (parts[1] === customerId) {
          resId = parts[0];
          break;
        }
      }
      const amount = p.amount.replace(/[^\d]/g, "");
      const status = p.status === "Paid" ? "PAID" : p.status === "Refunded" ? "REFUNDED" : "PENDING";
      let method = "CASH";
      if (p.method === "Card") method = "CARD-1234";
      else if (p.method === "Bank Transfer") method = "ONLINE-BOC";

      const dateStr = new Date().toISOString().slice(0, 10);
      return `${id}|${resId}|${customerId}|${amount}|${status}|${dateStr}|${method}`;
    });
    writeLines("payments.txt", paymentLines);
  }

  // 6. Save Reviews
  if (data.reviews) {
    const reviewLines = data.reviews.map((r: any) => {
      const id = r.id.replace("RV-", "").replace(/^0+/, "");
      // Customer ID
      const customerLines = readLines("customers.txt");
      let customerId = "1";
      for (const line of customerLines) {
        const pLine = line.split("|");
        if (pLine.length >= 4 && pLine[3].toLowerCase() === r.guest.toLowerCase()) {
          customerId = pLine[0];
          break;
        }
      }
      const approved = r.status === "Approved" ? "true" : "false";
      // Split title and comment
      let title = "Feedback";
      let comment = r.comment;
      if (r.comment.includes(": ")) {
        const idx = r.comment.indexOf(": ");
        title = r.comment.substring(0, idx);
        comment = r.comment.substring(idx + 2);
      }
      const dateStr = new Date().toISOString().slice(0, 10);
      return `${id}|${customerId}|${r.room || "102"}|${r.rating}|${title}|${comment}|${dateStr}|${approved}|PUBLIC`;
    });
    writeLines("reviews.txt", reviewLines);
  }

  // 7. Save Services
  if (data.services) {
    const serviceLines = data.services.map((s: any) => {
      const id = s.id.replace("S-", "").replace(/^0+/, "");
      const price = s.category === "Spa" ? 92000 : s.name.includes("Wi-Fi") ? 2500 : s.name.includes("Buffet") ? 12000 : 18000;
      const avail = s.status === "Available" ? "true" : "false";
      const cat = s.category.toUpperCase();
      const tier = cat === "SPA" ? "PREMIUM" : "BASIC";
      return `${id}|${s.name}|${price}|${avail}|${s.name} Service|${cat}|${tier}`;
    });
    writeLines("services.txt", serviceLines);
  }

  // 8. Save and Synchronize Customer Services Requests
  const existingReqs = readLines("customer_services.txt");
  const reqMap = new Set(existingReqs.map(line => {
    const p = line.split("|");
    return p.length >= 4 ? `${p[1]}|${p[2]}|${p[3]}` : ""; // CustID|ResID|ServiceID
  }));

  const customerLines = readLines("customers.txt");
  const newReqs = [...existingReqs];
  let nextReqId = existingReqs.length > 0
    ? Math.max(...existingReqs.map(line => parseInt(line.split("|")[0], 10) || 1)) + 1
    : 1;

  if (data.reservations && data.services) {
    data.reservations.forEach((r: any) => {
      const resId = r.id.replace("R-", "");

      // Find customer ID
      let custId = "1";
      for (const line of customerLines) {
        const p = line.split("|");
        if (p.length >= 4 && p[3].toLowerCase() === r.guest.toLowerCase()) {
          custId = p[0];
          break;
        }
      }

      // Check if we need to auto-append default simulated service bookings
      if (resId === "2048" && !reqMap.has(`${custId}|${resId}|1`)) {
        newReqs.push(`${nextReqId++}|${custId}|${resId}|1|1|105000|REQUESTED`);
        reqMap.add(`${custId}|${resId}|1`);
      }
      if (resId === "2051" && !reqMap.has(`${custId}|${resId}|6`)) {
        newReqs.push(`${nextReqId++}|${custId}|${resId}|6|1|12000|REQUESTED`);
        reqMap.add(`${custId}|${resId}|6`);
      }
    });
  }
  writeLines("customer_services.txt", newReqs);
}

// Vite Connect middleware handler
export function apiDbMiddleware(req: IncomingMessage, res: ServerResponse, next: () => void) {
  if (req.url === "/api/db" && req.method === "GET") {
    try {
      const data = loadDatabaseJSON();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    } catch (e: any) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: e.message }));
    }
  } else if (req.url === "/api/db/save" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);

        // --- BACKEND VALIDATION ---
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // 1. Validate Customers
        if (parsed.customers) {
          for (const c of parsed.customers) {
            if (!c.email || !emailRegex.test(c.email)) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: `Invalid email address: ${c.email || "Empty"}` }));
              return;
            }
            if (!c.name || c.name.trim().length < 2) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Name must be at least 2 characters long" }));
              return;
            }
          }
        }

        // 2. Validate Payments (if applicable)
        if (parsed.payments) {
          for (const p of parsed.payments) {
            if (!p.amount || p.amount === "LKR 0") {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Invalid payment amount" }));
              return;
            }
          }
        }

        saveDatabaseJSON(parsed);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } catch (e: any) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  } else {
    next();
  }
}
