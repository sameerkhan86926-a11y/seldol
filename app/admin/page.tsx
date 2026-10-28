"use client";

import { useEffect, useState, type FormEvent } from "react";
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
} from "lucide-react";

type ProductItem = {
  id: string;
  title: string;
  price: number;
  category: string;
  location: string;
  condition: string;
  is_featured?: boolean;
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
  created_at: string;
};

export default function AdminDashboard() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Secure Auth State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Data States
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notice, setNotice] = useState("");

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

      // Backend check: Kya ye logged-in user admin hai?
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
      // 1. Backend Authentication via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      if (data.user) {
        // 2. Database Authorization Verification
        const { data: profile, error: profileErr } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", data.user.id)
          .single();

        if (profileErr || !profile?.is_admin) {
          await supabase.auth.signOut();
          throw new Error("Access Denied: This account does not have root admin privileges.");
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
      const { data: prodData } = await supabase
        .from("products")
        .select("*, profiles(full_name, phone)")
        .order("created_at", { ascending: false });

      if (prodData) {
        setProducts(prodData as ProductItem[]);
      }

      const { data: userData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (userData) {
        setUsersList(userData as UserProfile[]);
      }
    } catch (err: any) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Permanently delete this advertisement listing from SELDOL?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setNotice("Listing permanently deleted.");
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
        prev.map((p) => (p.id === id ? { ...p, is_featured: !currentStatus } : p))
      );
      setNotice("Featured listing status updated.");
    } catch (err: any) {
      alert("Update error: " + err.message);
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMarketValue = products.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-violet-500" size={36} />
        <p className="mt-3 text-xs tracking-wider uppercase font-bold text-slate-400">
          Verifying Database Admin Rights...
        </p>
      </div>
    );
  }

  // Secure Backend Login Card
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center p-6 text-white font-sans selection:bg-violet-600">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#111726] p-8 shadow-2xl space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-violet-600/30">
              <Lock size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Admin Gatekeeper</h1>
              <p className="text-xs text-slate-400 mt-1">
                Encrypted database authentication powered by Supabase.
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
                  <Loader2 size={16} className="animate-spin" /> Verifying with Server...
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
              ← Return to SELDOL Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 antialiased font-sans">
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
                  ROOT ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Authenticated via PostgreSQL RLS</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
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
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
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
              <span>Inventory Value</span>
              <IndianRupee size={16} className="text-emerald-400" />
            </div>
            <p className="text-3xl font-black text-emerald-400">
              ₹{(totalMarketValue / 100000).toFixed(2)} Lakh
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111726] p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Promoted Ads</span>
              <Star size={16} className="text-amber-400" />
            </div>
            <p className="text-3xl font-black text-white">
              {products.filter((p) => p.is_featured).length}
            </p>
          </div>
        </div>

        {/* Catalog Table */}
        <div className="rounded-3xl border border-slate-800 bg-[#111726] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">Live Product Catalog</h2>
              <p className="text-xs text-slate-400">Manage, promote, or delete any ad across the entire platform.</p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs w-full sm:w-72">
              <Search size={15} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search ad title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-900/50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Item Details</th>
                  <th className="py-3 px-4">Seller Contact</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 font-semibold">
                      No advertisements found matching your query.
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
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                          title="Delete Listing"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {notice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-bold text-slate-900 shadow-2xl">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}
    </div>
  );
}
