import { createClient } from "@supabase/supabase-js";

// Helper to get runtime environment variables or fallback configuration
export const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || (typeof window !== "undefined" ? localStorage.getItem("vortex_supabase_url") : "") || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (typeof window !== "undefined" ? localStorage.getItem("vortex_supabase_key") : "") || "";
  return { url, anonKey };
};

// Singleton Client Instance to prevent "Multiple GoTrueClient instances" warning
let cachedClient: ReturnType<typeof createClient> | null = null;
let cachedClientKey = "";

export function getSupabaseClient() {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey || url.includes("your-supabase-url") || anonKey.includes("your-anon-key")) {
    return null;
  }
  const key = `${url}::${anonKey}`;
  if (!cachedClient || cachedClientKey !== key) {
    cachedClientKey = key;
    cachedClient = createClient(url, anonKey);
  }
  return cachedClient;
}

export const isSupabaseConfigured = Boolean(getSupabaseClient());

/* ─── AUTHENTICATION HELPERS ───────────────────────────────────────── */
const LOCAL_SESSION_KEY = "vortex_admin_session";

export async function signInAdmin(email: string, password: string): Promise<{ success: boolean; error?: string; user?: any }> {
  const cleanEmail = email.trim();
  const client = getSupabaseClient();

  if (client) {
    // 1. Try Supabase Auth (Authentication -> Users)
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!error && data.session) {
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ email: data.user?.email, loggedInAt: Date.now() }));
        }
        return { success: true, user: data.user };
      }

      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          return {
            success: false,
            error: "Email not confirmed. Go to Supabase Dashboard -> Authentication -> Users, click your user and confirm email, or enable Auto-Confirm.",
          };
        }
      }
    } catch (e) {
      console.warn("Supabase Auth check failed:", e);
    }

    // 2. Try public.admins table in Supabase Database
    try {
      const { data, error } = await (client.from("admins") as any)
        .select("*")
        .eq("email", cleanEmail)
        .eq("password", password)
        .maybeSingle();

      if (!error && data) {
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ email: data.email, loggedInAt: Date.now() }));
        }
        return { success: true, user: { email: data.email } };
      }
    } catch (e) {
      console.warn("Admins table check failed:", e);
    }

    // If Supabase is connected but credentials don't match -> REJECT!
    return {
      success: false,
      error: "Invalid email or password. Please check your Supabase Auth credentials or public.admins table.",
    };
  }

  // Fallback ONLY when Supabase environment URL is completely unconfigured / offline mode
  if (cleanEmail === "admin@vortexfitness.com" && password === "admin123") {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({ email: cleanEmail, loggedInAt: Date.now() }));
    }
    return { success: true, user: { email: cleanEmail } };
  }

  return { success: false, error: "Invalid admin email or password." };
}

export async function signOutAdmin(): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn("Supabase signout failed:", e);
    }
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_SESSION_KEY);
  }
}

export async function checkAdminSession(): Promise<boolean> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data } = await client.auth.getSession();
      if (data.session) return true;
    } catch (e) {}
  }

  if (typeof window !== "undefined") {
    const session = localStorage.getItem(LOCAL_SESSION_KEY);
    return Boolean(session);
  }
  return false;
}

export interface Registration {
  id: string;
  created_at: string;
  user_name: string;
  email: string;
  phone: string;
  package: string;
  status: "pending" | "approved" | "contacted";
}

export interface PackageData {
  id: string;
  name: string;
  duration: string;
  tagline: string;
  price: number;
  features: string[];
}

// Initial default package data
export const DEFAULT_PACKAGES: PackageData[] = [
  {
    id: "starter",
    name: "Starter",
    duration: "1 Month",
    tagline: "Ideal for small businesses & beginners",
    price: 2900,
    features: [
      "Unified dashboard",
      "Finance management module",
      "Inventory control",
      "Basic reporting and analytics",
      "10 user accounts",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    duration: "3 Months",
    tagline: "Perfect for growing teams & athletes",
    price: 7900,
    features: [
      "All Basic Plan features",
      "Advanced analytics & insights",
      "Custom workflow automation",
      "Priority email & chat support",
      "25 user accounts",
    ],
  },
  {
    id: "advance",
    name: "Advance",
    duration: "6 Months",
    tagline: "Designed for scaling enterprises",
    price: 14900,
    features: [
      "All Growth Plan features",
      "Dedicated account manager",
      "Custom API integrations",
      "24/7 SLA uptime guarantee",
      "50 user accounts",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    duration: "12 Months",
    tagline: "Full power for large organizations",
    price: 24900,
    features: [
      "Unlimited user accounts",
      "Custom infrastructure setup",
      "Dedicated strategy sessions",
      "White-glove onboarding",
      "Unlimited data retention",
    ],
  },
];

// Local Storage Helper keys
const LOCAL_REGS_KEY = "vortex_registrations";
const LOCAL_PACKAGES_KEY = "vortex_packages";

/* ─── API HELPER FUNCTIONS ────────────────────────────────────────── */

// Get Registrations (Supabase DB or LocalStorage fallback)
export async function getRegistrations(): Promise<Registration[]> {
  const activeClient = getSupabaseClient();

  if (activeClient) {
    try {
      const { data, error } = await (activeClient.from("registrations") as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as Registration[];
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to local state:", e);
    }
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(LOCAL_REGS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
  }
  return [];
}

// Add New Registration
export async function saveRegistration(user: Omit<Registration, "id" | "created_at" | "status">): Promise<boolean> {
  const newReg: Registration = {
    ...user,
    id: "reg-" + Date.now(),
    created_at: new Date().toISOString(),
    status: "pending",
  };

  const activeClient = getSupabaseClient();

  if (activeClient) {
    try {
      const { error } = await (activeClient.from("registrations") as any).insert([
        {
          user_name: user.user_name,
          email: user.email,
          phone: user.phone,
          package: user.package,
          status: "pending",
        }
      ]);
      if (!error) return true;
    } catch (e) {
      console.warn("Supabase insert failed, using fallback:", e);
    }
  }

  // Fallback to localStorage
  if (typeof window !== "undefined") {
    const current = await getRegistrations();
    const updated = [newReg, ...current];
    localStorage.setItem(LOCAL_REGS_KEY, JSON.stringify(updated));
  }
  return true;
}

// Update Registration Status
export async function updateRegistrationStatus(id: string, status: "pending" | "approved" | "contacted"): Promise<boolean> {
  const activeClient = getSupabaseClient();

  if (activeClient) {
    try {
      const { error } = await (activeClient.from("registrations") as any)
        .update({ status })
        .eq("id", id);
      if (!error) return true;
    } catch (e) {
      console.warn("Supabase update status failed:", e);
    }
  }

  // LocalStorage fallback
  if (typeof window !== "undefined") {
    const current = await getRegistrations();
    const updated = current.map((r) => (r.id === id ? { ...r, status } : r));
    localStorage.setItem(LOCAL_REGS_KEY, JSON.stringify(updated));
  }
  return true;
}

// Delete Registration
export async function deleteRegistration(id: string): Promise<boolean> {
  const activeClient = getSupabaseClient();

  if (activeClient) {
    try {
      const { error } = await (activeClient.from("registrations") as any).delete().eq("id", id);
      if (!error) return true;
    } catch (e) {
      console.warn("Supabase delete failed:", e);
    }
  }

  // LocalStorage fallback
  if (typeof window !== "undefined") {
    const current = await getRegistrations();
    const updated = current.filter((r) => r.id !== id);
    localStorage.setItem(LOCAL_REGS_KEY, JSON.stringify(updated));
  }
  return true;
}

// Get Packages (Sorted by price ascending)
export async function getPackagesData(): Promise<PackageData[]> {
  const activeClient = getSupabaseClient();

  if (activeClient) {
    try {
      const { data, error } = await (activeClient.from("packages") as any)
        .select("*")
        .order("price", { ascending: true });
      if (!error && data && data.length > 0) {
        return (data as PackageData[]).sort((a, b) => Number(a.price) - Number(b.price));
      }
    } catch (e) {
      console.warn("Supabase package fetch failed:", e);
    }
  }

  // LocalStorage fallback
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(LOCAL_PACKAGES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return (parsed as PackageData[]).sort((a, b) => Number(a.price) - Number(b.price));
      } catch {}
    }
    localStorage.setItem(LOCAL_PACKAGES_KEY, JSON.stringify(DEFAULT_PACKAGES));
  }
  return [...DEFAULT_PACKAGES].sort((a, b) => Number(a.price) - Number(b.price));
}

// Update Package Details & Price
export async function updatePackageData(pkg: PackageData): Promise<boolean> {
  const activeClient = getSupabaseClient();

  if (activeClient) {
    try {
      const { error } = await (activeClient.from("packages") as any)
        .upsert([pkg], { onConflict: "id" });
      if (!error) return true;
    } catch (e) {
      console.warn("Supabase package update failed:", e);
    }
  }

  // LocalStorage fallback
  if (typeof window !== "undefined") {
    const current = await getPackagesData();
    const updated = current.map((p) => (p.id === pkg.id ? pkg : p));
    localStorage.setItem(LOCAL_PACKAGES_KEY, JSON.stringify(updated));
  }
  return true;
}
