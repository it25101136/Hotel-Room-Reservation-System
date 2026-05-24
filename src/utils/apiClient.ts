export interface DbData {
  rooms: any[];
  reservations: any[];
  customers: any[];
  payments: any[];
  reviews: any[];
  services: any[];
  authUsers?: any[];
}

/**
 * Service to handle client-server data synchronization with backend file databases
 */
export const apiClient = {
  /**
   * Fetches the entire parsed text-file database state from the server.
   */
  async loadDb(): Promise<DbData | null> {
    try {
      const res = await fetch("/api/db");
      if (!res.ok) throw new Error("Failed to load database from server");
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn("apiClient: Failed to fetch from server API. Falling back to local storage.", e);
      return null;
    }
  },

  /**
   * Saves the entire state of the website back to the backend text files.
   */
  async saveDb(data: DbData): Promise<boolean> {
    try {
      const res = await fetch("/api/db/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to save database to server");
      const result = await res.json();
      return !!result.success;
    } catch (e) {
      console.error("apiClient: Failed to save database to server.", e);
      return false;
    }
  },

  /**
   * Synchronizes specific collections or the whole state to backend files and updates local storage.
   */
  async syncCollection(
    key: "rooms" | "reservations" | "customers" | "payments" | "reviews" | "services" | "authUsers",
    list: any[]
  ) {
    // 1. Update localStorage first for instant UX feedback and client fallback
    const lsKey = key === "authUsers" ? "aurum-auth-users" : `aurum-${key}`;
    localStorage.setItem(lsKey, JSON.stringify(list));

    // 2. Fetch the entire current state from localStorage or load from server
    const currentData: DbData = {
      rooms: JSON.parse(localStorage.getItem("aurum-rooms") || "[]"),
      reservations: JSON.parse(localStorage.getItem("aurum-reservations") || "[]"),
      customers: JSON.parse(localStorage.getItem("aurum-customers") || "[]"),
      payments: JSON.parse(localStorage.getItem("aurum-payments") || "[]"),
      reviews: JSON.parse(localStorage.getItem("aurum-reviews") || "[]"),
      services: JSON.parse(localStorage.getItem("aurum-services") || "[]"),
      authUsers: JSON.parse(localStorage.getItem("aurum-auth-users") || "[]")
    };

    // Override the specific updated key
    currentData[key] = list;

    // 3. Save to server files
    await this.saveDb(currentData);
  }
};
