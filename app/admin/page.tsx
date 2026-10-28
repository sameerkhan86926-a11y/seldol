"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ShoppingBag,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  Package,
  Users,
  IndianRupee,
  Star,
  ArrowLeft,
  ExternalLink,
  Loader2,
  Search,
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
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  async function checkAdminAccess() {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Verify admin column
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (profile?.is_admin) {
        setIsAdmin(true);
        await Promise.all([loadAllProducts(), loadAllUsers()]);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Admin verification error:", err);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }

  async function loadAllProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*, profiles(full_name, phone)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data as ProductItem[]);
    }
  }

  async function loadAllUsers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUsersList(data as UserProfile[]);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to permanently delete this listing?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setNotice("Listing permanently removed.");
    } catch (err: any) {
      alert("Error: " + err.message);
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
      setNotice("Featured status updated.");
    } catch (err: any) {
      alert("Error: " + err.message);
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
      <div className="min-h-screen bg-[#0b1020] flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-violet-500" size={36} />
        <p className="mt-3 text-xs tracking-wider uppercase font-bold text-slate-400">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0b1020] flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="h-16 w-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-500/20">
          <ShieldAlert size={32} />
        </div>
        <h1 className="mt-4 text-2xl font-black">Access Denied</h1>
        <p className="mt-1 text-xs text-slate-400 max-w-sm">
          You do not have administrative privileges to access this panel.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold hover:bg-violet-700"
        >
          <ArrowLeft size={16} /> Return to SELDOL
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 antialiased font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-600/30">
              <ShoppingBag size={20} strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight">SELDOL CONTROL PANEL</span>
                <span className="bg-rose-500/20 text-rose-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-rose-500/30">
                  ROOT ADMIN
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <span>Marketplace</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* KPI Analytics Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Total Listings</span>
              <Package size={16} className="text-violet-400" />
            </div>
            <p className="text-2xl font-black text-white">{products.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Registered Users</span>
              <Users size={16} className="text-indigo-400" />
            </div>
            <p className="text-2xl font-black text-white">{usersList.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Inventory Value</span>
              <IndianRupee size={16} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-400">
              ₹{(totalMarketValue / 100000).toFixed(2)} Lakh
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
              <span>Featured Ads</span>
              <Star size={16} className="text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white">
              {products.filter((p) => p.is_featured).length}
            </p>
          </div>
        </div>

        {/* Listings Moderation Section */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">Live Ads Moderation</h2>
              <p className="text-xs text-slate-400">Review, flag, or delete live classified listings.</p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs w-full sm:w-72">
              <Search size={15} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search ad title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-800/40 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Seller</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || ""}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover bg-slate-800"
                        />
                        <div>
                          <p className="font-bold text-white line-clamp-1">{p.title}</p>
                          <p className="text-[10px] text-slate-400">{p.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-200">{p.profiles?.full_name || "Unknown"}</p>
                      <p className="text-[10px] text-slate-500">{p.profiles?.phone || "No Phone"}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-black text-white">₹{p.price.toLocaleString("en-IN")}</td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                        title="Delete Listing"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

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
