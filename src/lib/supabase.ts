import { createClient } from "@supabase/supabase-js";
import { SITE_CONFIG, MembershipPlan } from "./business-config";

// Helper to get runtime environment variables
export const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return { url, anonKey };
};

// Singleton Client Instance
let cachedClient: ReturnType<typeof createClient> | null = null;
let cachedClientKey = "";

export function getSupabaseClient() {
  const { url, anonKey } = getSupabaseConfig();
  if (
    !url ||
    !anonKey ||
    url.includes("your-supabase-url") ||
    anonKey.includes("your-anon-key")
  ) {
    return null;
  }
  const key = `${url}::${anonKey}`;
  if (!cachedClient || cachedClientKey !== key) {
    cachedClientKey = key;
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return cachedClient;
}

export const isSupabaseConfigured = Boolean(getSupabaseClient());

/* ─── AUTHENTICATION HELPERS ───────────────────────────────────────── */

/**
 * Signs in an admin user via official Supabase Auth.
 * Client-only hardcoded bypass credentials have been completely removed.
 */
export async function signInAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: any }> {
  const cleanEmail = email.trim();
  const client = getSupabaseClient();

  if (!client) {
    return {
      success: false,
      error:
        "Supabase environment variables are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Authentication failed. No user found." };
    }

    // Verify that the authenticated user is an authorized admin
    const isAdmin = await checkAdminSession();
    if (!isAdmin) {
      await client.auth.signOut();
      return {
        success: false,
        error:
          "Access denied. This account is authenticated but not registered in the admin_users table.",
      };
    }

    return { success: true, user: data.user };
  } catch (e: any) {
    return {
      success: false,
      error: e?.message || "An unexpected error occurred during admin sign in.",
    };
  }
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
}

/**
 * Validates whether the active session belongs to an explicitly authorized administrator.
 * Checks the public.admin_users table or non-user-editable app_metadata.role.
 */
export async function checkAdminSession(): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const {
      data: { session },
    } = await client.auth.getSession();

    if (!session || !session.user) return false;

    // Check trusted JWT app_metadata (set by Supabase service role / admin API)
    if (session.user.app_metadata?.role === "admin") {
      return true;
    }

    // Check explicit admin_users table
    const { data, error } = await (client.from("admin_users") as any)
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (!error && data?.user_id) {
      return true;
    }

    return false;
  } catch (e) {
    console.warn("Admin authorization verification error:", e);
    return false;
  }
}

/* ─── DATA MODELS ─────────────────────────────────────────────────── */

export interface Registration {
  id: string;
  created_at: string;
  user_name: string;
  email: string;
  phone: string;
  package: "starter" | "growth" | "advance" | "professional";
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

export const DEFAULT_PACKAGES: PackageData[] = SITE_CONFIG.plans.map((p) => ({
  id: p.id,
  name: p.name,
  duration: p.duration,
  tagline: p.tagline,
  price: p.priceBDT,
  features: p.features,
}));

const LOCAL_REGS_KEY = "vortex_registrations";
const LOCAL_PACKAGES_KEY = "vortex_packages";

/* ─── API HELPER FUNCTIONS ────────────────────────────────────────── */

/**
 * Fetch registrations - strictly requires admin session in production Supabase.
 */
export async function getRegistrations(): Promise<Registration[]> {
  const activeClient = getSupabaseClient();

  if (activeClient) {
    try {
      const { data, error } = await (activeClient.from("registrations") as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) return data as Registration[];
      if (error) {
        console.warn("Supabase fetch registrations error (RLS enforced):", error.message);
      }
    } catch (e) {
      console.warn("Supabase fetch failed:", e);
    }
  }

  // Local development fallback when running without Supabase credentials
  if (typeof window !== "undefined" && !isSupabaseConfigured) {
    const saved = localStorage.getItem(LOCAL_REGS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
  }
  return [];
}

export interface NewRegistrationInput {
  user_name: string;
  email: string;
  phone: string;
  package: string;
}

/**
 * Submit a new registration with strict server/client input validation.
 * Status is always locked to 'pending'. Visitors cannot set prices or approval status.
 */
export async function saveRegistration(input: NewRegistrationInput): Promise<{
  success: boolean;
  error?: string;
}> {
  const cleanName = input.user_name?.trim();
  const cleanEmail = input.email?.trim().toLowerCase();
  const cleanPhone = input.phone?.replace(/\D/g, "");
  const cleanPackage = input.package?.trim().toLowerCase();

  // Field validation
  if (!cleanName || cleanName.length < 2) {
    return { success: false, error: "Please enter a valid full name." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return { success: false, error: "Please enter a valid email address." };
  }
  // Exact 11-digit phone number validation
  if (!cleanPhone || !/^[0-9]{11}$/.test(cleanPhone)) {
    return {
      success: false,
      error: "Phone number must be exactly 11 digits (e.g., 017XXXXXXXX).",
    };
  }

  const validPackages = ["starter", "growth", "advance", "professional"] as const;
  if (!validPackages.includes(cleanPackage as any)) {
    return { success: false, error: "Please select a valid membership plan." };
  }

  const activeClient = getSupabaseClient();

  // If Supabase is unconfigured or offline, NEVER return fake success.
  // Only report success when a row has actually been saved to the database.
  if (!activeClient) {
    return {
      success: false,
      error: "Registration database is temporarily unavailable. Please try again later or contact us directly.",
    };
  }

  try {
    const { error } = await (activeClient.from("registrations") as any).insert([
      {
        user_name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        package: cleanPackage,
        status: "pending", // Authoritative status - cannot be overridden
      },
    ]);

    if (!error) {
      return { success: true };
    }
    return { success: false, error: error.message };
  } catch (e: any) {
    return { success: false, error: e?.message || "Failed to submit registration to database." };
  }
}

/**
 * Update registration status (Admin only).
 */
export async function updateRegistrationStatus(
  id: string,
  status: "pending" | "approved" | "contacted"
): Promise<boolean> {
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

  if (typeof window !== "undefined" && !isSupabaseConfigured) {
    const current = await getRegistrations();
    const updated = current.map((r) => (r.id === id ? { ...r, status } : r));
    localStorage.setItem(LOCAL_REGS_KEY, JSON.stringify(updated));
  }
  return true;
}

/**
 * Delete registration (Admin only).
 */
export async function deleteRegistration(id: string): Promise<boolean> {
  const activeClient = getSupabaseClient();

  if (activeClient) {
    try {
      const { error } = await (activeClient.from("registrations") as any)
        .delete()
        .eq("id", id);
      if (!error) return true;
    } catch (e) {
      console.warn("Supabase delete failed:", e);
    }
  }

  if (typeof window !== "undefined" && !isSupabaseConfigured) {
    const current = await getRegistrations();
    const updated = current.filter((r) => r.id !== id);
    localStorage.setItem(LOCAL_REGS_KEY, JSON.stringify(updated));
  }
  return true;
}

/**
 * Fetch packages, falling back to SITE_CONFIG default plans.
 */
export async function getPackagesData(): Promise<PackageData[]> {
  const activeClient = getSupabaseClient();

  if (activeClient) {
    try {
      const { data, error } = await (activeClient.from("packages") as any)
        .select("*")
        .order("price", { ascending: true });
      if (!error && data && data.length > 0) {
        return (data as PackageData[]).sort(
          (a, b) => Number(a.price) - Number(b.price)
        );
      }
    } catch (e) {
      console.warn("Supabase package fetch failed:", e);
    }
  }

  if (typeof window !== "undefined" && !isSupabaseConfigured) {
    const saved = localStorage.getItem(LOCAL_PACKAGES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return (parsed as PackageData[]).sort(
          (a, b) => Number(a.price) - Number(b.price)
        );
      } catch {}
    }
  }
  return [...DEFAULT_PACKAGES].sort((a, b) => Number(a.price) - Number(b.price));
}

/**
 * Update package data (Admin only).
 */
export async function updatePackageData(pkg: PackageData): Promise<boolean> {
  const activeClient = getSupabaseClient();

  if (activeClient) {
    try {
      const { error } = await (activeClient.from("packages") as any).upsert(
        [pkg],
        { onConflict: "id" }
      );
      if (!error) return true;
    } catch (e) {
      console.warn("Supabase package update failed:", e);
    }
  }

  if (typeof window !== "undefined" && !isSupabaseConfigured) {
    const current = await getPackagesData();
    const updated = current.map((p) => (p.id === pkg.id ? pkg : p));
    localStorage.setItem(LOCAL_PACKAGES_KEY, JSON.stringify(updated));
  }
  return true;
}
