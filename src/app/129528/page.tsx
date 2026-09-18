"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Package,
  RefreshCw,
  Search,
  Trash2,
  Edit,
  Save,
  X,
  Download,
  ArrowLeft,
  TrendingUp,
  LayoutDashboard,
  Calendar,
  ArrowUpRight,
  LogOut,
  Lock,
  Mail,
  KeyRound,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import {
  getRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  getPackagesData,
  updatePackageData,
  Registration,
  PackageData,
  signInAdmin,
  signOutAdmin,
  checkAdminSession,
  isSupabaseConfigured,
} from "@/lib/supabase";

export default function HiddenAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "packages">("overview");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Package Edit Modal State
  const [editingPkg, setEditingPkg] = useState<PackageData | null>(null);
  const [pkgFeaturesInput, setPkgFeaturesInput] = useState("");

  // Check authentication session on mount
  useEffect(() => {
    checkAdminSession().then((hasSession) => {
      setIsAuthenticated(hasSession);
      if (hasSession) {
        loadData();
      }
    });
  }, []);

  // Load Dashboard Data
  const loadData = async () => {
    setIsLoading(true);
    const regs = await getRegistrations();
    const pkgs = await getPackagesData();
    setRegistrations(regs);
    setPackages(pkgs);
    setIsLoading(false);
  };

  // Login Submit Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter both email address and password.");
      return;
    }
    setIsLoggingIn(true);
    setLoginError("");

    const result = await signInAdmin(loginEmail, loginPassword);
    setIsLoggingIn(false);

    if (result.success) {
      setIsAuthenticated(true);
      loadData();
    } else {
      setLoginError(result.error || "Invalid Supabase email or password.");
    }
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    await signOutAdmin();
    setIsAuthenticated(false);
  };

  // Status Change
  const handleStatusChange = async (id: string, newStatus: "pending" | "approved" | "contacted") => {
    await updateRegistrationStatus(id, newStatus);
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  // Delete Registration
  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;
    await deleteRegistration(id);
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
  };

  // Open Edit Package Modal
  const handleEditPackage = (pkg: PackageData) => {
    setEditingPkg({ ...pkg });
    setPkgFeaturesInput(pkg.features.join("\n"));
  };

  // Save Package Details
  const handleSavePackage = async () => {
    if (!editingPkg) return;
    const updatedFeatures = pkgFeaturesInput
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const updated = {
      ...editingPkg,
      features: updatedFeatures,
    };

    await updatePackageData(updated);
    setPackages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingPkg(null);
  };

  // Export Users to CSV
  const exportToCSV = () => {
    if (registrations.length === 0) {
      alert("No registered users to export.");
      return;
    }
    const headers = ["ID,User Name,Email,Phone,Package,Status,Created At"];
    const rows = filteredRegistrations.map((r) =>
      `"${r.id}","${r.user_name}","${r.email}","${r.phone}","${r.package}","${r.status}","${r.created_at}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vortex_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered registrations
  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics Metrics
  const totalUsers = registrations.length;
  const pendingCount = registrations.filter((r) => r.status === "pending").length;
  const approvedCount = registrations.filter((r) => r.status === "approved").length;
  const totalEstimatedRevenue = registrations.reduce((acc, r) => {
    const pkg = packages.find((p) => p.id.toLowerCase() === r.package.toLowerCase());
    return acc + (pkg ? Number(pkg.price) : 0);
  }, 0);

  // ── 1. UNAUTHENTICATED LOGIN SCREEN ─────────────────────────────────
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#07090E] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00A86B]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-md bg-[#0f1420] border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#00A86B] text-white font-black text-xl flex items-center justify-center mx-auto shadow-lg shadow-[#00A86B]/30 mb-4">
              V
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">
              VORTEX ADMIN PORTAL
            </h1>
            <p className="text-slate-400 text-xs font-medium">
              Enter your Supabase email and password to access the admin dashboard.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
                ADMIN EMAIL
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@vortexfitness.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00A86B] transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00A86B] transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#00A86B] hover:bg-[#048254] text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#00A86B]/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoggingIn ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <ShieldCheck size={16} />
              )}
              {isLoggingIn ? "AUTHENTICATING..." : "SIGN IN TO DASHBOARD"}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="pt-4 border-t border-slate-800/80 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium transition-colors"
            >
              <ArrowLeft size={14} /> Back to main website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading Session state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#07090E] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={24} className="animate-spin text-[#00A86B]" />
          <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Loading Admin Portal...</span>
        </div>
      </div>
    );
  }

  // ── 2. AUTHENTICATED DASHBOARD ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-800 font-sans antialiased flex flex-col pb-20 md:pb-8">
      
      {/* ── TOP HEADER (Mobile Responsive Header) ────────────────────────── */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-900 font-black text-base sm:text-lg tracking-tight group"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#00A86B] text-white flex items-center justify-center font-extrabold text-xs sm:text-sm shadow-md shadow-[#00A86B]/20">
                V
              </div>
              <span className="uppercase tracking-tight text-slate-900 text-xs sm:text-sm md:text-base">Vortex Admin</span>
            </Link>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/60">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === "overview"
                    ? "bg-[#00A86B] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === "users"
                    ? "bg-[#00A86B] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Users ({registrations.length})
              </button>

              <button
                onClick={() => setActiveTab("packages")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === "packages"
                    ? "bg-[#00A86B] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Packages
              </button>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={loadData}
              className="p-2 sm:p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={isLoading ? "animate-spin text-[#00A86B]" : ""} />
            </button>

            {registrations.length > 0 && (
              <button
                onClick={exportToCSV}
                className="hidden sm:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-full border border-slate-200 transition-all"
              >
                <Download size={13} /> Export CSV
              </button>
            )}

            {/* Profile Pill & Sign Out Button */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold px-3 py-1.5 rounded-full transition-colors border border-red-200"
                title="Sign Out"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Tab Pill Bar */}
        <div className="flex md:hidden border-t border-slate-100 px-4 py-2 bg-slate-50 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === "overview"
                ? "bg-[#00A86B] text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === "users"
                ? "bg-[#00A86B] text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            Users ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab("packages")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === "packages"
                ? "bg-[#00A86B] text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            Packages
          </button>
        </div>
      </header>

      {/* ── MAIN DASHBOARD CONTAINER ─────────────────────────────────── */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex gap-6 lg:gap-8">
        
        {/* Left Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col items-center justify-between w-16 bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm flex-shrink-0">
          <div className="space-y-6 flex flex-col items-center">
            <button
              onClick={() => setActiveTab("overview")}
              className={`p-3 rounded-2xl transition-all ${
                activeTab === "overview"
                  ? "bg-[#00A86B] text-white shadow-md shadow-[#00A86B]/30"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              }`}
              title="Overview"
            >
              <LayoutDashboard size={20} />
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`p-3 rounded-2xl transition-all ${
                activeTab === "users"
                  ? "bg-[#00A86B] text-white shadow-md shadow-[#00A86B]/30"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              }`}
              title="Registered Users"
            >
              <Users size={20} />
            </button>

            <button
              onClick={() => setActiveTab("packages")}
              className={`p-3 rounded-2xl transition-all ${
                activeTab === "packages"
                  ? "bg-[#00A86B] text-white shadow-md shadow-[#00A86B]/30"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              }`}
              title="Package Pricing"
            >
              <Package size={20} />
            </button>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <button
              onClick={handleSignOut}
              className="p-3 text-slate-400 hover:text-red-600 rounded-2xl block"
              title="Log Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA ────────────────────────────────────────── */}
        <main className="flex-1 space-y-6 sm:space-y-8 min-w-0">
          
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back, Admin
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                Live membership analytics & package manager.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-white px-3.5 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-sm">
                <Calendar size={13} className="text-[#00A86B]" />
                <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
            </div>
          </div>

          {/* ── TAB 1: OVERVIEW DASHBOARD ───────────────────────────────── */}
          {activeTab === "overview" && (
            <div className="space-y-6 sm:space-y-8">
              
              {/* Top KPI Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
                
                {/* Green Hero KPI Card */}
                <div className="md:col-span-6 lg:col-span-4 bg-gradient-to-br from-[#00A86B] to-[#048254] rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-[#00A86B]/20 flex flex-col justify-between min-h-[190px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold opacity-80 uppercase tracking-wider">
                        Total Registrations
                      </p>
                      <span className="text-xs font-medium opacity-90">Live Applications</span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                      <Users size={18} />
                    </div>
                  </div>

                  <div className="my-2">
                    <h3 className="text-3xl sm:text-4xl font-black tracking-tight">{totalUsers} Users</h3>
                  </div>

                  <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs font-semibold">
                    <span>Pending: {pendingCount}</span>
                    <span>Approved: {approvedCount}</span>
                  </div>
                </div>

                {/* Center Activity Graph */}
                <div className="md:col-span-6 lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Application Activity</h4>
                      <p className="text-xs text-slate-500 font-medium">Monthly trend</p>
                    </div>
                    <span className="bg-emerald-50 text-[#00A86B] text-xs font-bold px-2.5 py-1 rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="flex items-end justify-between gap-2 h-28 pt-4 px-1">
                    {[
                      { month: "Jan", height: "30%" },
                      { month: "Feb", height: "45%" },
                      { month: "Mar", height: "60%" },
                      { month: "Apr", height: "100%", active: true },
                      { month: "May", height: "70%" },
                      { month: "Jun", height: "85%" },
                    ].map((bar, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                        <div
                          className={`w-full rounded-full transition-all ${
                            bar.active
                              ? "bg-[#00A86B] shadow-md shadow-[#00A86B]/30"
                              : "bg-emerald-100"
                          }`}
                          style={{ height: bar.height }}
                        />
                        <span className="text-[10px] font-semibold text-slate-500">{bar.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Revenue Summary Card */}
                <div className="md:col-span-12 lg:col-span-3 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Est. Monthly Value
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      ৳ {totalEstimatedRevenue.toLocaleString()} BDT
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Total Applications</span>
                      <span className="font-bold text-slate-900">{registrations.length}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Packages Active</span>
                      <span className="font-bold text-slate-900">{packages.length}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("users")}
                    className="w-full text-center py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors mt-4"
                  >
                    View Directory
                  </button>
                </div>

              </div>

              {/* Applications Table / Empty State */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Recent Member Applications</h3>
                    <p className="text-xs text-slate-500 font-medium">Submitted via Join Now form</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("users")}
                    className="text-xs font-bold text-[#00A86B] hover:underline flex items-center gap-1"
                  >
                    View All <ArrowUpRight size={14} />
                  </button>
                </div>

                {registrations.length === 0 ? (
                  <div className="py-12 px-4 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                      <Users size={24} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">No Applications Yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4 leading-relaxed">
                      Applications submitted by visitors on the Join Now form will automatically appear here in real-time.
                    </p>
                    <Link
                      href="/join"
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00A86B] bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    >
                      Test Join Now Form <ArrowUpRight size={13} />
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[600px]">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                          <th className="py-3 px-4">Applicant Name</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Requested Plan</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {registrations.slice(0, 5).map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              <div>{r.user_name}</div>
                              <div className="text-[11px] font-normal text-slate-400">{r.email}</div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-500 font-medium">
                              {new Date(r.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-extrabold text-slate-800 uppercase text-[11px] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                                {r.package}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                  r.status === "approved"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : r.status === "contacted"
                                    ? "bg-blue-50 text-blue-600"
                                    : "bg-amber-50 text-amber-600"
                                }`}
                              >
                                ● {r.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleStatusChange(r.id, "approved")}
                                className="text-xs font-bold text-[#00A86B] hover:underline"
                              >
                                Approve
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ── TAB 2: REGISTERED USERS DIRECTORY ───────────────────────── */}
          {activeTab === "users" && (
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm space-y-6">
              
              {/* Directory Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">Registered Users Directory</h3>
                  <p className="text-xs text-slate-500 font-medium">Manage and review all incoming applications</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search name, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#00A86B]"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-full px-3.5 py-2 text-xs text-slate-700 font-semibold focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="contacted">Contacted</option>
                  </select>
                </div>
              </div>

              {/* Table or Empty State */}
              {registrations.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Users size={24} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">No Users Registered Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    When visitors complete the membership registration form on the website, their details will immediately be saved and listed here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3.5 px-4">Applicant Name</th>
                        <th className="py-3.5 px-4">Contact Details</th>
                        <th className="py-3.5 px-4">Requested Plan</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRegistrations.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-900">
                            {user.user_name}
                          </td>
                          <td className="py-4 px-4 text-slate-600">
                            <div>{user.email}</div>
                            <div className="text-slate-400 text-[11px] font-mono">{user.phone}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-extrabold text-slate-900 uppercase text-[11px] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                              {user.package}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-500 font-medium text-[11px]">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={user.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  user.id,
                                  e.target.value as "pending" | "approved" | "contacted"
                                )
                              }
                              className={`px-3 py-1 rounded-full text-xs font-bold focus:outline-none border cursor-pointer ${
                                user.status === "approved"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : user.status === "contacted"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              <option value="pending">● Pending</option>
                              <option value="approved">● Approved</option>
                              <option value="contacted">● Contacted</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete user"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}

          {/* ── TAB 3: PACKAGE & PRICING MANAGER ────────────────────────── */}
          {activeTab === "packages" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Manage Pricing Packages</h3>
                <p className="text-slate-500 text-xs mt-0.5 font-medium">
                  Update plan pricing (BDT), titles, taglines, and features list.
                </p>
              </div>

              {/* Package Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#00A86B]">
                          {pkg.duration}
                        </span>
                        <button
                          onClick={() => handleEditPackage(pkg)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-[#00A86B] text-slate-700 hover:text-white rounded-full transition-all text-xs font-bold flex items-center gap-1.5"
                        >
                          <Edit size={13} /> Edit
                        </button>
                      </div>

                      <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{pkg.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                        {pkg.tagline}
                      </p>

                      <div className="mt-4 mb-5 flex items-baseline">
                        <span className="text-3xl sm:text-4xl font-extrabold text-slate-950">৳ {pkg.price}</span>
                        <span className="text-xs font-bold text-slate-400 ml-1.5 uppercase">BDT</span>
                      </div>

                      <div className="border-t border-slate-100 pt-4 space-y-2">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Included Features:
                        </p>
                        <ul className="space-y-2 text-xs text-slate-600 font-medium">
                          {pkg.features.map((f, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[#00A86B] font-bold">✓</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── MOBILE BOTTOM NAVIGATION BAR ──────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex items-center justify-around py-2 px-4 shadow-lg">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
            activeTab === "overview" ? "text-[#00A86B]" : "text-slate-400"
          }`}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
            activeTab === "users" ? "text-[#00A86B]" : "text-slate-400"
          }`}
        >
          <Users size={18} />
          <span>Users ({registrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("packages")}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-all ${
            activeTab === "packages" ? "text-[#00A86B]" : "text-slate-400"
          }`}
        >
          <Package size={18} />
          <span>Packages</span>
        </button>
      </nav>

      {/* ── EDIT PACKAGE MODAL (Image 1 Mockup Design) ───────────────── */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0d121d] border border-slate-800 rounded-3xl p-5 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Edit Package: {editingPkg.name}
              </h3>
              <button
                onClick={() => setEditingPkg(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              
              {/* PACKAGE NAME */}
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  PACKAGE NAME
                </label>
                <input
                  type="text"
                  value={editingPkg.name}
                  onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                  className="w-full bg-[#141b2b] border border-slate-700/80 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:border-[#0ae448] font-medium"
                />
              </div>

              {/* PRICE (BDT) - NO /MONTHLY */}
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  PRICE (BDT)
                </label>
                <input
                  type="number"
                  value={editingPkg.price}
                  onChange={(e) =>
                    setEditingPkg({ ...editingPkg, price: Number(e.target.value) })
                  }
                  className="w-full bg-[#141b2b] border border-slate-700/80 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:border-[#0ae448] font-medium text-base"
                />
              </div>

              {/* DURATION LABEL */}
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  DURATION LABEL
                </label>
                <input
                  type="text"
                  value={editingPkg.duration}
                  onChange={(e) => setEditingPkg({ ...editingPkg, duration: e.target.value })}
                  className="w-full bg-[#141b2b] border border-slate-700/80 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:border-[#0ae448] font-medium"
                />
              </div>

              {/* TAGLINE */}
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  TAGLINE
                </label>
                <input
                  type="text"
                  value={editingPkg.tagline}
                  onChange={(e) => setEditingPkg({ ...editingPkg, tagline: e.target.value })}
                  className="w-full bg-[#141b2b] border border-slate-700/80 rounded-xl px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:border-[#0ae448] font-medium"
                />
              </div>

              {/* FEATURES LIST */}
              <div>
                <label className="block font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  FEATURES LIST (ONE FEATURE PER LINE)
                </label>
                <textarea
                  rows={5}
                  value={pkgFeaturesInput}
                  onChange={(e) => setPkgFeaturesInput(e.target.value)}
                  className="w-full bg-[#141b2b] border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#0ae448] font-mono leading-relaxed text-xs"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-800/80 pt-4 sm:pt-5">
              <button
                onClick={() => setEditingPkg(null)}
                className="px-5 py-2.5 sm:py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePackage}
                className="px-6 py-2.5 sm:py-3 rounded-xl bg-[#0ae448] hover:bg-[#08c93f] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#0ae448]/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Save size={16} /> SAVE PACKAGE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
