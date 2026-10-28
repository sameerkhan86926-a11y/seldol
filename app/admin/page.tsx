"use client";

import { useEffect, useState, useMemo, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ShoppingBag,
  Trash2,
  CheckCircle2,
  Package,
  Users,
  IndianRupee,
  Star,
  ExternalLink,
  Loader2,
  Search,
  Lock,
  KeyRound,
  LogOut,
  Mail,
  ShieldAlert,
  Ban,
  UserCheck,
  Megaphone,
  Download,
  AlertTriangle,
  RefreshCw,
  Eye,
  Check,
  X,
} from "lucide-react";

type ProductItem = {
  id: string;
  user_id: string;
  title: string;
  price: number;
  category: string;
  location: string;
  condition: string;
  status: "active" | "pending" | "rejected" | "sold";
  is_featured?: boolean;
  rejection_reason?: string;
  created_at: string;
  images: string[];
  profiles?: {
    full_name: string;
    phone: string;
  };
};

type UserProfile = {
  id: string;
  full_name: string;
  phone: string;
  city: string;
  is_admin?: boolean;
  is_banned?: boolean;
  created_at: string;
};

type AdminTab = "listings" | "users" | "broadcasts" | "analytics";

export default function AdminDashboard() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("listings");

  // Secure Auth State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Data States
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [newBroadcast, setNewBroadcast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [notice, setNotice] = useState("");

  // Rejection Modal
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    checkCurrentAdminSession();
  }, []);

  async function checkCurrentAdminSession() {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;

      if (!currentUser) {
        setIsAdminAuthenticated(false);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", currentUser.id)
        .single();

      if (profile?.is_admin) {
        setIsAdminAuthenticated(true);
        await loadDashboardData();
      } else {
        setIsAdminAuthenticated(false);
      }
    } catch (err) {
      console.error("Admin check failed:", err);
      setIsAdminAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdminLogin(e: FormEvent) {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile, error: profileErr } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", data.user.id)
          .single();

        if (profileErr || !profile?.is_admin) {
          await supabase.auth.signOut();
          throw new Error("Access Denied: Account lacks root admin permissions.");
        }

        setIsAdminAuthenticated(true);
        await loadDashboardData();
      }
    } catch (err: any) {
      setAuthError(err.message || "Failed to authenticate.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleAdminLogout() {
    await supabase.auth.signOut();
    setIsAdminAuthenticated(false);
    setEmail("");
    setPassword("");
  }

  async function loadDashboardData() {
    try {
      const [{ data: prodData }, { data: userData }, { data: broadData }] =
        await Promise.all([
          supabase
            .from("products")
            .select("*, profiles(full_name, phone)")
            .order("created_at", { ascending: false }),
          supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("broadcasts")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

      if (prodData) setProducts(prodData as ProductItem[]);
      if (userData) setUsersList(userData as UserProfile[]);
      if (broadData) setBroadcasts(broadData);
    } catch (err: any) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // Listing Moderation Actions
  async function updateListingStatus(
    id: string,
    status: "active" | "pending" | "rejected",
    reason?: string
  ) {
    try {
      const payload: any = { status };
      if (reason) payload.rejection_reason = reason;

      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", id);

      if (error) throw error;

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status, rejection_reason: reason } : p
        )
      );
      setRejectId(null);
      setRejectReason("");
      setNotice(`Listing status changed to ${status.toUpperCase()}`);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Permanently delete this advertisement listing from SELDOL?"))
      return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setNotice("Listing permanently removed.");
    } catch (err: any) {
      alert("Delete error: " + err.message);
    }
  }

  async function toggleFeatured(id: string, currentStatus: boolean | undefined) {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_featured: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, is_featured: !currentStatus } : p
        )
      );
      setNotice("Featured listing status updated.");
    } catch (err: any) {
      alert("Update error: " + err.message);
    }
  }

  // User Ban Toggle
  async function toggleUserBan(userId: string, currentBanned: boolean | undefined) {
    const action = currentBanned ? "unban" : "ban";
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_banned: !currentBanned })
        .eq("id", userId);

      if (error) throw error;

      setUsersList((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, is_banned: !currentBanned } : u
        )
      );
      setNotice(`User ${action}ned successfully.`);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  }

  // Broadcast Actions
  async function addBroadcast(e: FormEvent) {
    e.preventDefault();
    if (!newBroadcast.trim()) return;

    try {
      const { data, error } = await supabase
        .from("broadcasts")
        .insert({ message: newBroadcast.trim(), is_active: true })
        .select()
        .single();

      if (error) throw error;
      setBroadcasts((prev) => [data, ...prev]);
      setNewBroadcast("");
      setNotice("Broadcast banner published.");
    } catch (err: any) {
      alert("Broadcast error: " + err.message);
    }
  }

  async function deleteBroadcast(id: string) {
    try {
      const { error } = await supabase.from("broadcasts").delete().eq("id", id);
      if (error) throw error;
      setBroadcasts((prev) => prev.filter((b) => b.id !== id));
      setNotice("Broadcast deleted.");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  }

  // CSV Exporter
  function exportListingsCSV() {
    const headers = ["ID", "Title", "Price", "Category", "Location", "Condition", "Status", "Seller"];
    const rows = products.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.price,
      p.category,
      `"${p.location.replace(/"/g, '""')}"`,
      p.condition,
      p.status || "active",
      `"${(p.profiles?.full_name || "Unknown").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `seldol_listings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.profiles?.full_name || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = categoryFilter === "All" || p.category === categoryFilter;
      const matchesStatus =
        statusFilter === "All" || (p.status || "active") === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  const totalMarketValue = useMemo(
    () => products.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0),
    [products]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-violet-500" size={36} />
        <p className="mt-3 text-xs tracking-wider uppercase font-bold text-slate-400">
          Loading SELDOL Enterprise Control System...
        </p>
      </div>
    );
  }

  // Auth Gate
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-6 text-white font-sans selection:bg-violet-600">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#111726] p-8 shadow-2xl space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-violet-600/30">
              <Lock size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Root Admin Access</h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your administrative credentials to verify privileges.
              </p>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Email
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-3 text-xs focus-within:border-violet-500">
                <Mail size={16} className="text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="seldol@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-3 text-xs focus-within:border-violet-500">
                <KeyRound size={16} className="text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-white outline-none"
                />
              </div>
            </div>

            {authError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400">
                <ShieldAlert size={16} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-violet-600/30 hover:brightness-105 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Verifying Credentials...
                </>
              ) : (
                "Authorize & Open Dashboard"
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs font-bold text-slate-500 hover:text-slate-300 transition"
            >
              ← Back to SELDOL Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 antialiased font-sans">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-[#111726]/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-600/30">
              <ShoppingBag size={22} strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight">SELDOL CONTROL CENTER</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ENTERPRISE ROOT
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Authenticated via PostgreSQL RLS</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setLoading(true);
                void loadDashboardData();
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
              title="Refresh Data"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
            >
              <span>Marketplace</span>
              <ExternalLink size={14} />
            </Link>

            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500 hover:text-white transition"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 border-t border-slate-800/80 pt-2 pb-2 text-xs font-bold">
          {[
            { id: "listings" as AdminTab, label: "Live Listings", count: products.length },
            { id: "users" as AdminTab, label: "Users & Bans", count: usersList.length },
            { id: "broadcasts" as AdminTab, label: "System Broadcasts", count: broadcasts.length },
            { id: "analytics" as AdminTab, label: "Platform Overview" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition ${
                activeTab === tab.id
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-600/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-[#111726] p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Total Listings</span>
              <Package size={16} className="text-violet-400" />
            </div>
            <p className="text-3xl font-black text-white">{products.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111726] p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Users Database</span>
              <Users size={16} className="text-indigo-400" />
            </div>
            <p className="text-3xl font-black text-white">{usersList.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111726] p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Inventory GMV</span>
              <IndianRupee size={16} className="text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400">
              ₹{(totalMarketValue / 100000).toFixed(2)} Lakh
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111726] p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Banned Accounts</span>
              <Ban size={16} className="text-rose-400" />
            </div>
            <p className="text-3xl font-black text-rose-400">
              {usersList.filter((u) => u.is_banned).length}
            </p>
          </div>
        </div>

        {/* ==================== TAB 1: LISTINGS MODERATION ==================== */}
        {activeTab === "listings" && (
          <div className="rounded-3xl border border-slate-800 bg-[#111726] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-black tracking-tight text-white">Live Product Catalog</h2>
                <p className="text-xs text-slate-400">Moderate status, promote to featured, or permanently delete.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={exportListingsCSV}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs">
                <Search size={15} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search title, seller, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Mobiles">Mobiles</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Fashion">Fashion</option>
                <option value="Accessories">Accessories</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-900/50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Seller Contact</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-semibold">
                        No advertisements found.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0] || ""}
                              alt=""
                              className="h-11 w-11 rounded-xl object-cover bg-slate-800"
                            />
                            <div>
                              <p className="font-bold text-white line-clamp-1">{p.title}</p>
                              <p className="text-[10px] text-slate-400">{p.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-200">{p.profiles?.full_name || "Direct Seller"}</p>
                          <p className="text-[10px] text-slate-500">{p.profiles?.phone || "No Phone"}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-300">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-black text-white">₹{p.price.toLocaleString("en-IN")}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                              p.status === "active"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : p.status === "pending"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                : p.status === "rejected"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : "bg-slate-700 text-slate-400"
                            }`}
                          >
                            {p.status || "active"}
                          </span>
                          {p.rejection_reason && (
                            <p className="text-[9px] text-rose-400 mt-1 line-clamp-1" title={p.rejection_reason}>
                              Reason: {p.rejection_reason}
                            </p>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => toggleFeatured(p.id, p.is_featured)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                              p.is_featured
                                ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                            }`}
                          >
                            {p.is_featured ? "★ Featured" : "Regular"}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {p.status !== "active" && (
                              <button
                                onClick={() => updateListingStatus(p.id, "active")}
                                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-1.5 text-emerald-400 hover:bg-emerald-500 hover:text-white transition"
                                title="Approve Listing"
                              >
                                <Check size={13} />
                              </button>
                            )}

                            {p.status !== "rejected" && (
                              <button
                                onClick={() => setRejectId(p.id)}
                                className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-1.5 text-amber-400 hover:bg-amber-500 hover:text-white transition"
                                title="Reject with Reason"
                              >
                                <X size={13} />
                              </button>
                            )}

                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                              title="Delete Permanently"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: USERS & BAN SYSTEM ==================== */}
        {activeTab === "users" && (
          <div className="rounded-3xl border border-slate-800 bg-[#111726] p-6 space-y-6">
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">Registered User Directory</h2>
              <p className="text-xs text-slate-400">View user phone numbers, platform roles, and handle fraud prevention bans.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-900/50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3 px-4">User Name</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ban Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center font-black">
                          {u.full_name?.[0] || "U"}
                        </div>
                        <span>{u.full_name || "Anonymous Member"}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{u.phone || "Not linked"}</td>
                      <td className="py-3.5 px-4 text-slate-400">{u.city || "India"}</td>
                      <td className="py-3.5 px-4">
                        {u.is_admin ? (
                          <span className="rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 text-[10px] font-black">
                            ADMIN
                          </span>
                        ) : (
                          <span className="rounded-md bg-slate-800 text-slate-400 px-2 py-0.5 text-[10px] font-bold">
                            SELLER/BUYER
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {u.is_banned ? (
                          <span className="rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 text-[10px] font-black">
                            BANNED
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black">
                            ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!u.is_admin && (
                          <button
                            onClick={() => toggleUserBan(u.id, u.is_banned)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ml-auto ${
                              u.is_banned
                                ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white"
                                : "bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white"
                            }`}
                          >
                            {u.is_banned ? (
                              <>
                                <UserCheck size={14} /> Unban
                              </>
                            ) : (
                              <>
                                <Ban size={14} /> Ban User
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: SYSTEM BROADCASTS ==================== */}
        {activeTab === "broadcasts" && (
          <div className="rounded-3xl border border-slate-800 bg-[#111726] p-6 space-y-6">
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">Live Platform Banner Broadcasts</h2>
              <p className="text-xs text-slate-400">Push urgent warnings, maintenance alerts, or festive notices to all marketplace visitors.</p>
            </div>

            <form onSubmit={addBroadcast} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. Diwal offer: Verify buyer details in person before transfer!"
                value={newBroadcast}
                onChange={(e) => setNewBroadcast(e.target.value)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-violet-700 flex items-center gap-1.5"
              >
                <Megaphone size={14} /> Broadcast
              </button>
            </form>

            <div className="space-y-3">
              {broadcasts.length === 0 ? (
                <p className="text-xs text-slate-500">No active broadcast announcements.</p>
              ) : (
                broadcasts.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Megaphone size={18} className="text-amber-400 shrink-0" />
                      <p className="text-xs text-white font-medium">{b.message}</p>
                    </div>
                    <button
                      onClick={() => deleteBroadcast(b.id)}
                      className="text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: PLATFORM ANALYTICS ==================== */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-slate-800 bg-[#111726] p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Inventory by Category</h3>
              <div className="space-y-3">
                {["Mobiles", "Vehicles", "Electronics", "Furniture", "Fashion", "Accessories"].map(
                  (cat) => {
                    const count = products.filter((p) => p.category === cat).length;
                    const percent = products.length ? (count / products.length) * 100 : 0;
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-semibold">{cat}</span>
                          <span className="text-slate-400">{count} ({percent.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-violet-600 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#111726] p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Security & Health Report</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-300">Database Engine</span>
                  <span className="font-bold text-emerald-400">PostgreSQL (Supabase Live)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-300">Realtime WebSocket Channels</span>
                  <span className="font-bold text-emerald-400">Operational</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-300">Pending Ads for Review</span>
                  <span className="font-bold text-amber-400">
                    {products.filter((p) => p.status === "pending").length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-300">Storage Bucket Policy</span>
                  <span className="font-bold text-emerald-400">Public CDN (`product-images`)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Reject Modal */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-[#111726] p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Specify Rejection Reason</h3>
            <textarea
              rows={3}
              placeholder="e.g. Inappropriate photo, duplicate listing, or unclear pricing."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-white outline-none focus:border-violet-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => updateListingStatus(rejectId, "rejected", rejectReason)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notice */}
      {notice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-bold text-slate-900 shadow-2xl">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}
    </div>
  );
}
