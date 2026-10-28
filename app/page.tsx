"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import {
  Search,
  Heart,
  MessageCircle,
  UserRound,
  Plus,
  MapPin,
  ChevronRight,
  ChevronLeft,
  X,
  Smartphone,
  CarFront,
  Laptop,
  Armchair,
  Shirt,
  Watch,
  LayoutGrid,
  List,
  Package,
  ShoppingBag,
  ShieldCheck,
  Menu,
  Trash2,
  ArrowLeft,
  Send,
  Phone,
  CheckCircle2,
  Sparkles,
  IndianRupee,
  Star,
  BadgeCheck,
  ImagePlus,
  MessageSquare,
  Share2,
  LogOut,
  LogIn,
  Loader2,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";

type PageName =
  | "home"
  | "details"
  | "sell"
  | "myads"
  | "wishlist"
  | "messages"
  | "profile";

type ItemCondition = "Brand New" | "Like New" | "Good" | "Fair";

type Product = {
  id: string;
  userId: string;
  title: string;
  price: number;
  isNegotiable: boolean;
  category: string;
  condition: ItemCondition;
  location: string;
  description: string;
  images: string[];
  seller: string;
  sellerRating?: number;
  phone: string;
  isFeatured?: boolean;
  status?: string;
  createdAt: number;
};

type ChatMessage = {
  id: string;
  product_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
};

type ChatThread = {
  key: string;
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  otherUserId: string;
  otherUserName: string;
  lastMessage: string;
  lastTime: string;
};

const CATEGORIES = [
  { name: "All", icon: LayoutGrid },
  { name: "Mobiles", icon: Smartphone },
  { name: "Vehicles", icon: CarFront },
  { name: "Electronics", icon: Laptop },
  { name: "Furniture", icon: Armchair },
  { name: "Fashion", icon: Shirt },
  { name: "Accessories", icon: Watch },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatTime = (timestamp: number) => {
  const diffMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / (1000 * 60)));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

export default function SeldolMarketplace() {
  const [page, setPage] = useState<PageName>("home");
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All");
  const [conditionFilter, setConditionFilter] = useState<string>("All");
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Nav, Notice & Broadcast
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const [liveBanner, setLiveBanner] = useState<string>("");

  // Sell Form State
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newNegotiable, setNewNegotiable] = useState(true);
  const [newCategory, setNewCategory] = useState("Mobiles");
  const [newCondition, setNewCondition] = useState<ItemCondition>("Like New");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  // Authenticated User State
  const [user, setUser] = useState<any>(null);
  const [profileName, setProfileName] = useState("Guest");
  const [profilePhone, setProfilePhone] = useState("");
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isBannedUser, setIsBannedUser] = useState(false);

  // 1-on-1 Dedicated Chat State
  const [activeChat, setActiveChat] = useState<{
    productId: string;
    productTitle: string;
    productImage: string;
    otherUserId: string;
    otherUserName: string;
    price: number;
  } | null>(null);

  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [chatText, setChatText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(false);

  // 1. Session & Live Data Fetching
  useEffect(() => {
    let active = true;

    async function initUser() {
      const { data } = await supabase.auth.getSession();
      if (active && data?.session?.user) {
        const u = data.session.user;
        setUser(u);
        await verifyUserProfile(u);
        fetchWishlist(u.id);
        fetchUserChatThreads(u.id);
      }
    }

    void initUser();
    void fetchLiveProducts();
    void fetchLiveBroadcast();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session?.user) {
        const u = session.user;
        setUser(u);
        void verifyUserProfile(u);
        fetchWishlist(u.id);
        fetchUserChatThreads(u.id);
      } else {
        setUser(null);
        setFavorites([]);
        setChatThreads([]);
        setActiveChat(null);
        setIsAdminUser(false);
        setIsBannedUser(false);
      }
    });

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Check Profile Roles (Admin and Ban check)
  async function verifyUserProfile(u: any) {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, is_admin, is_banned")
        .eq("id", u.id)
        .single();

      if (data) {
        setProfileName(data.full_name || u.email?.split("@")[0] || "SELDOL Member");
        setProfilePhone(data.phone || "");
        setIsAdminUser(Boolean(data.is_admin));
        setIsBannedUser(Boolean(data.is_banned));
      } else {
        setProfileName(u.user_metadata?.full_name || u.email?.split("@")[0] || "SELDOL Member");
        setProfilePhone(u.user_metadata?.phone || "");
      }
    } catch {
      setProfileName(u.user_metadata?.full_name || u.email?.split("@")[0] || "SELDOL Member");
    }
  }

  // Fetch Live Broadcast from Admin
  async function fetchLiveBroadcast() {
    try {
      const { data } = await supabase
        .from("broadcasts")
        .select("message")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setLiveBanner(data[0].message);
      }
    } catch {
      // Ignore if table not present
    }
  }

  // 2. Fetch Active Listings Only (Admin Rejected Items Excluded)
  async function fetchLiveProducts() {
    setLoadingProducts(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, profiles(full_name, phone, city)")
        .or("status.eq.active,status.is.null")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const formatted: Product[] = data.map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          title: item.title,
          price: Number(item.price),
          isNegotiable: Boolean(item.is_negotiable),
          category: item.category,
          condition: item.condition,
          location: item.location,
          description: item.description || "",
          images:
            item.images && item.images.length > 0
              ? item.images
              : ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=85"],
          seller: item.profiles?.full_name || "SELDOL Seller",
          sellerRating: 4.9,
          phone: item.profiles?.phone || "",
          isFeatured: Boolean(item.is_featured),
          status: item.status || "active",
          createdAt: new Date(item.created_at).getTime(),
        }));
        setProducts(formatted);
      }
    } catch (err: any) {
      console.error("Fetch products error:", err.message);
    } finally {
      setLoadingProducts(false);
    }
  }

  // 3. Fetch User Wishlist from Supabase
  async function fetchWishlist(userId: string) {
    try {
      const { data } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", userId);

      if (data) {
        setFavorites(data.map((w: any) => w.product_id));
      }
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    }
  }

  // 4. Fetch Isolated Chat Threads (Separated by Product + Other User)
  const fetchUserChatThreads = async (currentUserId: string) => {
    setLoadingThreads(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          id,
          product_id,
          sender_id,
          receiver_id,
          content,
          created_at,
          products (id, title, price, images, user_id),
          sender:profiles!messages_sender_id_fkey (id, full_name),
          receiver:profiles!messages_receiver_id_fkey (id, full_name)
        `)
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const threadMap = new Map<string, ChatThread>();

        data.forEach((m: any) => {
          const isSender = m.sender_id === currentUserId;
          const otherId = isSender ? m.receiver_id : m.sender_id;
          const otherName = isSender
            ? m.receiver?.full_name || "User"
            : m.sender?.full_name || "User";

          const key = `${m.product_id}_${otherId}`;

          if (!threadMap.has(key)) {
            threadMap.set(key, {
              key,
              productId: m.product_id,
              productTitle: m.products?.title || "Product Listing",
              productImage:
                m.products?.images?.[0] ||
                "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80",
              price: Number(m.products?.price) || 0,
              otherUserId: otherId,
              otherUserName: otherName,
              lastMessage: m.content,
              lastTime: m.created_at,
            });
          }
        });

        setChatThreads(Array.from(threadMap.values()));
      }
    } catch (err: any) {
      console.error("Threads fetch error:", err.message);
    } finally {
      setLoadingThreads(false);
    }
  };

  // 5. Realtime 1-on-1 Messages Listener (Strict Product + User Matching)
  useEffect(() => {
    if (!activeChat || !user) return;

    const loadConversation = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("product_id", activeChat.productId)
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${activeChat.otherUserId}),and(sender_id.eq.${activeChat.otherUserId},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data as ChatMessage[]);
      }
    };

    void loadConversation();

    const channel = supabase
      .channel(`chat_${activeChat.productId}_${user.id}_${activeChat.otherUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `product_id=eq.${activeChat.productId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          const isRelevant =
            (newMsg.sender_id === user.id && newMsg.receiver_id === activeChat.otherUserId) ||
            (newMsg.sender_id === activeChat.otherUserId && newMsg.receiver_id === user.id);

          if (isRelevant) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChat, user]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const ownProducts = products.filter((p) => user && p.userId === user.id);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }
    if (conditionFilter !== "All") {
      result = result.filter((p) => p.condition === conditionFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (location.trim()) {
      result = result.filter((p) =>
        p.location.toLowerCase().includes(location.toLowerCase().trim())
      );
    }
    if (maxPrice !== "All") {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    if (sort === "newest") result.sort((a, b) => b.createdAt - a.createdAt);

    return result;
  }, [products, category, conditionFilter, search, location, maxPrice, sort]);

  const showPage = (nextPage: PageName) => {
    setPage(nextPage);
    setMobileMenu(false);
    if (nextPage === "messages" && user) {
      fetchUserChatThreads(user.id);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      setNotice("Please log in to save favorites!");
      return;
    }

    const isFav = favorites.includes(productId);

    if (isFav) {
      setFavorites((prev) => prev.filter((id) => id !== productId));
      await supabase.from("wishlists").delete().match({ user_id: user.id, product_id: productId });
      setNotice("Removed from Wishlist");
    } else {
      setFavorites((prev) => [...prev, productId]);
      await supabase.from("wishlists").insert({ user_id: user.id, product_id: productId });
      setNotice("Saved to Wishlist ❤️");
    }
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
    setPage("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMultipleImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = 5 - uploadFiles.length;
    if (availableSlots <= 0) {
      setNotice("Maximum 5 photos allowed!");
      return;
    }

    const filesToAdd = Array.from(files).slice(0, availableSlots);
    setUploadFiles((prev) => [...prev, ...filesToAdd]);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === "string") {
          setPreviewImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    event.target.value = "";
  };

  const removeUploadImage = (index: number) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSell = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setNotice("Please sign in first to publish an ad!");
      return;
    }

    if (isBannedUser) {
      alert("Your account has been restricted by administrators from posting ads.");
      return;
    }

    if (!newTitle.trim() || !newPrice || !newLocation.trim()) {
      setNotice("Please fill in required fields!");
      return;
    }

    const priceNum = Number(newPrice);
    if (priceNum <= 0 || isNaN(priceNum)) {
      setNotice("Please enter a valid price");
      return;
    }

    setIsPublishing(true);

    try {
      const uploadedImageUrls: string[] = [];

      for (let i = 0; i < uploadFiles.length; i++) {
        const file = uploadFiles[i];
        const fileExt = file.name.split(".").pop() || "jpg";
        const cleanName = `${user.id}/${Date.now()}_img_${i}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(cleanName, file, { cacheControl: "3600", upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage.from("product-images").getPublicUrl(cleanName);
          uploadedImageUrls.push(data.publicUrl);
        } else {
          console.error("Storage upload warning:", uploadError);
        }
      }

      const finalImages =
        uploadedImageUrls.length > 0
          ? uploadedImageUrls
          : previewImages.length > 0
          ? previewImages
          : [
              "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=85",
            ];

      const { data: newRecord, error: insertError } = await supabase
        .from("products")
        .insert({
          user_id: user.id,
          title: newTitle.trim(),
          price: priceNum,
          is_negotiable: newNegotiable,
          category: newCategory,
          condition: newCondition,
          location: newLocation.trim(),
          description: newDescription.trim() || "No detailed description provided.",
          images: finalImages,
          status: "active",
        })
        .select("*, profiles(full_name, phone, city)")
        .single();

      if (insertError) throw insertError;

      const createdProduct: Product = {
        id: newRecord.id,
        userId: newRecord.user_id,
        title: newRecord.title,
        price: Number(newRecord.price),
        isNegotiable: Boolean(newRecord.is_negotiable),
        category: newRecord.category,
        condition: newRecord.condition,
        location: newRecord.location,
        description: newRecord.description,
        images: newRecord.images,
        seller: profileName,
        sellerRating: 5.0,
        phone: newPhone.trim() || profilePhone,
        status: "active",
        createdAt: Date.now(),
      };

      setProducts((prev) => [createdProduct, ...prev]);

      setNewTitle("");
      setNewPrice("");
      setNewLocation("");
      setNewDescription("");
      setNewPhone("");
      setUploadFiles([]);
      setPreviewImages([]);

      setSelectedProduct(createdProduct);
      setPage("details");
      setNotice("Ad published successfully to cloud! 🎉");
    } catch (err: any) {
      alert("Publishing error: " + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setNotice("Ad deleted successfully from database.");
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setFavorites([]);
    setChatThreads([]);
    setActiveChat(null);
    setIsAdminUser(false);
    setIsBannedUser(false);
    setNotice("Logged out.");
    showPage("home");
  };

  // Launch 1-on-1 Chat Session
  const startChat = (product: Product) => {
    if (!user) {
      setNotice("Please log in to chat with the seller!");
      return;
    }
    if (isBannedUser) {
      alert("Your account cannot send messages due to platform restrictions.");
      return;
    }
    if (user.id === product.userId) {
      setNotice("You cannot chat with your own listing!");
      return;
    }

    setActiveChat({
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0],
      price: product.price,
      otherUserId: product.userId,
      otherUserName: product.seller,
    });

    setPage("messages");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Safe Message Dispatch (Targeted Receiver)
  const sendChat = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !activeChat || !user || sendingMsg) return;

    if (isBannedUser) {
      alert("Your account is restricted from sending messages.");
      return;
    }

    setSendingMsg(true);
    const content = chatText.trim();
    setChatText("");

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          product_id: activeChat.productId,
          sender_id: user.id,
          receiver_id: activeChat.otherUserId,
          content: content,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMessages((prev) => [...prev, data as ChatMessage]);
        fetchUserChatThreads(user.id);
      }
    } catch (err: any) {
      console.error("Message send error:", err);
      setNotice("Failed to send message: " + err.message);
    } finally {
      setSendingMsg(false);
    }
  };

  const startWhatsApp = (product: Product) => {
    const digits = (product.phone || "").replace(/\D/g, "");
    if (!digits) {
      setNotice("Seller hasn't added a WhatsApp number.");
      return;
    }
    const phone = digits.length === 10 ? `91${digits}` : digits;
    const msg = `Hi ${product.seller}, I saw your ad for "${product.title}" (${money(
      product.price
    )}) on SELDOL. Is it still available?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const copyProductLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setNotice("Product link copied to clipboard! 📋");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 antialiased selection:bg-violet-600 selection:text-white">
      {/* Top Banner (Synced with Admin Broadcast) */}
      <div className="bg-slate-950 px-4 py-2 text-center text-xs font-medium text-slate-300">
        <span className="mr-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          VERIFIED MARKETPLACE
        </span>
        {liveBanner || "Buy & Sell pre-loved products directly with zero middleman commission across India."}
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button
            onClick={() => showPage("home")}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 transition group-hover:scale-105">
              <ShoppingBag size={22} strokeWidth={2.4} />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-950">
                SEL<span className="text-violet-600">DOL</span>
              </span>
              <span className="ml-1 rounded bg-violet-100 px-1 py-0.5 text-[9px] font-black tracking-wider text-violet-700">
                PRO
              </span>
            </div>
          </button>

          {/* Quick Search */}
          <div className="hidden max-w-lg flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 transition focus-within:border-violet-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100 md:flex">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (page !== "home") setPage("home");
              }}
              placeholder="Search mobiles, bikes, laptops, furniture..."
              className="w-full bg-transparent text-xs font-medium outline-none placeholder:text-slate-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
                <X size={15} />
              </button>
            )}
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => showPage("wishlist")}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-violet-600"
              title="Wishlist"
            >
              <Heart size={20} />
              {favorites.length > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              onClick={() => showPage("messages")}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-violet-600"
              title="Chats"
            >
              <MessageCircle size={20} />
            </button>

            <button
              onClick={() => showPage("myads")}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
            >
              <Package size={17} className="text-violet-600" />
              <span>My Ads ({ownProducts.length})</span>
            </button>

            {isAdminUser && (
              <Link
                href="/admin/"
                className="flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs font-bold text-amber-600 transition hover:bg-amber-500 hover:text-white"
              >
                <ShieldAlert size={15} />
                <span>Admin</span>
              </Link>
            )}

            {user ? (
              <button
                onClick={() => showPage("profile")}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50/50"
              >
                <UserRound size={17} className="text-slate-600" />
                <span>{profileName.split(" ")[0]}</span>
              </button>
            ) : (
              <Link
                href="/login/"
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50"
              >
                <LogIn size={15} className="text-violet-600" />
                <span>Login</span>
              </Link>
            )}

            <button
              onClick={() => showPage("sell")}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-violet-600/20 transition hover:brightness-105 active:scale-95"
            >
              <Plus size={16} strokeWidth={3} />
              <span>SELL NOW</span>
            </button>
          </div>

          {/* Mobile Right Bar */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => showPage("sell")}
              className="flex items-center gap-1 rounded-xl bg-violet-600 px-3 py-2 text-xs font-bold text-white shadow-sm"
            >
              <Plus size={15} />
              <span>Sell</span>
            </button>
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700"
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenu && (
          <div className="border-t border-slate-200 bg-white p-4 md:hidden">
            <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
              <button
                onClick={() => showPage("home")}
                className="flex items-center gap-2 rounded-xl p-3 hover:bg-slate-50"
              >
                <LayoutGrid size={18} className="text-violet-600" /> Home
              </button>
              <button
                onClick={() => showPage("wishlist")}
                className="flex items-center gap-2 rounded-xl p-3 hover:bg-slate-50"
              >
                <Heart size={18} className="text-rose-500" /> Wishlist ({favorites.length})
              </button>
              <button
                onClick={() => showPage("myads")}
                className="flex items-center gap-2 rounded-xl p-3 hover:bg-slate-50"
              >
                <Package size={18} className="text-indigo-600" /> My Ads ({ownProducts.length})
              </button>
              <button
                onClick={() => showPage("messages")}
                className="flex items-center gap-2 rounded-xl p-3 hover:bg-slate-50"
              >
                <MessageCircle size={18} className="text-emerald-600" /> Chats
              </button>
              {isAdminUser && (
                <Link
                  href="/admin/"
                  className="col-span-2 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-amber-800 border border-amber-200"
                >
                  <ShieldAlert size={18} className="text-amber-600" /> Open Root Admin Dashboard
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => showPage("profile")}
                  className="col-span-2 flex items-center gap-2 rounded-xl border border-slate-100 p-3 hover:bg-slate-50"
                >
                  <UserRound size={18} className="text-slate-600" /> Profile: {profileName}
                </button>
              ) : (
                <Link
                  href="/login/"
                  className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-slate-900 p-3 text-white"
                >
                  <LogIn size={18} /> Sign In to SELDOL
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Feed Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* ===================== HOME FEED ===================== */}
        {page === "home" && (
          <div className="space-y-8">
            {!search && category === "All" && !location && (
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-7 text-white shadow-xl sm:p-12">
                <div className="relative z-10 max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-200">
                    <Sparkles size={14} className="text-amber-300" />
                    Trusted Direct Buying & Selling
                  </div>
                  <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
                    Buy Smart. Sell Faster. <br />
                    <span className="bg-gradient-to-r from-violet-300 via-pink-200 to-indigo-200 bg-clip-text text-transparent">
                      Direct from Owners.
                    </span>
                  </h1>
                  <p className="text-sm text-slate-300 sm:text-base">
                    Skip dealer markups. Browse verified local listings across India with direct WhatsApp and calling features.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        const el = document.getElementById("browse-section");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="rounded-xl bg-violet-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-700"
                    >
                      Browse Ads
                    </button>
                    <button
                      onClick={() => showPage("sell")}
                      className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-xs font-black uppercase tracking-wider text-white backdrop-blur transition hover:bg-white/20"
                    >
                      + Post Free Ad
                    </button>
                  </div>
                </div>
                <div className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl" />
              </div>
            )}

            {/* Categories */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-black tracking-tight text-slate-900 sm:text-lg">
                  Popular Categories
                </h2>
                {category !== "All" && (
                  <button
                    onClick={() => setCategory("All")}
                    className="text-xs font-bold text-violet-600 hover:underline"
                  >
                    Reset category
                  </button>
                )}
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setCategory(cat.name);
                        const el = document.getElementById("browse-section");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`flex shrink-0 items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-xs font-bold transition ${
                        isSelected
                          ? "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-600/25"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={16} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            <div id="browse-section" className="space-y-4">
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                  <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                    <Search size={16} className="text-slate-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Title or keyword..."
                      className="w-full bg-transparent outline-none"
                    />
                    {search && (
                      <button onClick={() => setSearch("")}>
                        <X size={14} className="text-slate-400" />
                      </button>
                    )}
                  </div>

                  <div className="flex sm:w-48 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                    <MapPin size={16} className="text-violet-600" />
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City or area..."
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <select
                    value={conditionFilter}
                    onChange={(e) => setConditionFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none"
                  >
                    <option value="All">All Conditions</option>
                    <option value="Brand New">Brand New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>

                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none"
                  >
                    <option value="All">Max Budget</option>
                    <option value="5000">Under ₹5,000</option>
                    <option value="15000">Under ₹15,000</option>
                    <option value="30000">Under ₹30,000</option>
                    <option value="75000">Under ₹75,000</option>
                    <option value="150000">Under ₹1.5 Lakh</option>
                  </select>

                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                  </select>

                  <div className="hidden items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 sm:flex">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`rounded-lg p-1.5 ${
                        viewMode === "grid" ? "bg-white text-violet-600 shadow-sm" : "text-slate-400"
                      }`}
                    >
                      <LayoutGrid size={15} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`rounded-lg p-1.5 ${
                        viewMode === "list" ? "bg-white text-violet-600 shadow-sm" : "text-slate-400"
                      }`}
                    >
                      <List size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Header */}
              <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-500">
                <span>
                  Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items
                  {category !== "All" && ` in ${category}`}
                </span>
                {(search || location || maxPrice !== "All" || conditionFilter !== "All") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setLocation("");
                      setMaxPrice("All");
                      setConditionFilter("All");
                      setCategory("All");
                    }}
                    className="font-bold text-violet-600 hover:underline"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>

              {/* Real Listing Grid */}
              {loadingProducts ? (
                <div className="flex flex-col items-center justify-center p-16 text-slate-400">
                  <Loader2 size={32} className="animate-spin text-violet-600" />
                  <p className="mt-3 text-xs font-bold">Loading verified live listings...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                  <Package size={48} className="text-slate-300" />
                  <h3 className="mt-4 text-base font-bold text-slate-800">No items match your criteria</h3>
                  <p className="mt-1 text-xs text-slate-500">Try changing your search terms or filters.</p>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
                  {filteredProducts.map((item) => (
                    <ProductGridCard
                      key={item.id}
                      product={item}
                      isFav={favorites.includes(item.id)}
                      onToggleFav={() => toggleFavorite(item.id)}
                      onOpen={() => openProduct(item)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProducts.map((item) => (
                    <ProductListCard
                      key={item.id}
                      product={item}
                      isFav={favorites.includes(item.id)}
                      onToggleFav={() => toggleFavorite(item.id)}
                      onOpen={() => openProduct(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== PRODUCT DETAILS ===================== */}
        {page === "details" && selectedProduct && (
          <div className="space-y-6">
            <button
              onClick={() => showPage("home")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-violet-600"
            >
              <ArrowLeft size={16} /> Back to Listings
            </button>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
                    <img
                      src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                      alt={selectedProduct.title}
                      className="h-full w-full object-contain"
                    />
                    {selectedProduct.images.length > 1 && (
                      <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between">
                        <button
                          onClick={() =>
                            setActiveImageIndex((prev) =>
                              prev === 0 ? selectedProduct.images.length - 1 : prev - 1
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/80"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          onClick={() =>
                            setActiveImageIndex((prev) =>
                              prev === selectedProduct.images.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/80"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    )}
                    <span className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white">
                      {activeImageIndex + 1} / {selectedProduct.images.length}
                    </span>
                  </div>

                  {selectedProduct.images.length > 1 && (
                    <div className="mt-2 flex gap-2 overflow-x-auto p-1">
                      {selectedProduct.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImageIndex(i)}
                          className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                            activeImageIndex === i ? "border-violet-600 ring-2 ring-violet-200" : "border-slate-200 opacity-60"
                          }`}
                        >
                          <img src={img} alt="" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
                  <h3 className="text-base font-extrabold text-slate-900">Description & Specifications</h3>
                  <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <span className="text-slate-400">Condition</span>
                      <p className="mt-0.5 font-bold text-slate-800">{selectedProduct.condition}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <span className="text-slate-400">Category</span>
                      <p className="mt-0.5 font-bold text-slate-800">{selectedProduct.category}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <span className="text-slate-400">Pricing</span>
                      <p className="mt-0.5 font-bold text-slate-800">
                        {selectedProduct.isNegotiable ? "Negotiable" : "Fixed"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <span className="text-slate-400">Posted</span>
                      <p className="mt-0.5 font-bold text-slate-800">{formatTime(selectedProduct.createdAt)}</p>
                    </div>
                  </div>

                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-bold text-violet-700">
                        {selectedProduct.category}
                      </span>
                      <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                        {money(selectedProduct.price)}
                      </h1>
                      {selectedProduct.isNegotiable && (
                        <span className="text-xs font-semibold text-emerald-600">
                          ✓ Price is negotiable
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleFavorite(selectedProduct.id)}
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition ${
                        favorites.includes(selectedProduct.id)
                          ? "border-rose-200 bg-rose-50 text-rose-500"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Heart
                        size={20}
                        fill={favorites.includes(selectedProduct.id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  <h2 className="text-base font-bold text-slate-800">{selectedProduct.title}</h2>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin size={14} className="text-violet-600" />
                    <span>{selectedProduct.location}</span>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-lg font-black text-white">
                        {selectedProduct.seller[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <h4 className="truncate text-sm font-bold text-slate-900">
                            {selectedProduct.seller}
                          </h4>
                          <BadgeCheck size={16} className="text-violet-600" />
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                          <span className="flex items-center text-amber-500 font-bold">
                            <Star size={12} fill="currentColor" className="mr-0.5" />
                            {selectedProduct.sellerRating || 4.9}
                          </span>
                          <span>•</span>
                          <span>Verified Seller</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {(!user || user.id !== selectedProduct.userId) && (
                      <button
                        onClick={() => startChat(selectedProduct)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 active:scale-95"
                      >
                        <MessageCircle size={17} />
                        Chat With Seller
                      </button>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => startWhatsApp(selectedProduct)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 py-3 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100"
                      >
                        <MessageSquare size={16} /> WhatsApp
                      </button>

                      {selectedProduct.phone ? (
                        <a
                          href={`tel:${selectedProduct.phone}`}
                          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-xs font-bold text-slate-800 transition hover:bg-slate-100"
                        >
                          <Phone size={16} /> Call Seller
                        </a>
                      ) : (
                        <button
                          disabled
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-3 text-xs font-semibold text-slate-400 opacity-60"
                        >
                          <Phone size={14} /> Call Hidden
                        </button>
                      )}
                    </div>

                    <button
                      onClick={copyProductLink}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      <Share2 size={14} /> Share Listing
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900">
                  <ShieldCheck size={20} className="shrink-0 text-amber-700" />
                  <div>
                    <strong className="font-bold">SELDOL Safe Trading Tip:</strong>
                    <p className="mt-0.5 text-amber-800/90 leading-relaxed">
                      Always meet the seller in public spaces. Test the item thoroughly before paying via UPI or cash.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== SELL ITEM FORM ===================== */}
        {page === "sell" && (
          <div className="mx-auto max-w-2xl space-y-6">
            <button
              onClick={() => showPage("home")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-violet-600"
            >
              <ArrowLeft size={16} /> Cancel & Return
            </button>

            {!user ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                  <UserRound size={28} />
                </div>
                <h2 className="mt-4 text-xl font-black text-slate-900">Login Required to Sell</h2>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  Please sign in or create a free SELDOL account before posting your products.
                </p>
                <Link
                  href="/login/"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-violet-600/20 hover:bg-violet-700"
                >
                  <LogIn size={16} /> Go to Login Page
                </Link>
              </div>
            ) : isBannedUser ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm text-rose-800">
                <ShieldAlert size={36} className="mx-auto text-rose-600" />
                <h2 className="mt-3 text-xl font-black">Account Restricted</h2>
                <p className="mt-1 text-xs text-rose-700 max-w-sm mx-auto">
                  Your account has been restricted by administrators from posting new listings. Contact support.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Post Free Advertisement</h1>
                  <p className="mt-1 text-xs text-slate-500">
                    Your photos will be hosted securely on Supabase Storage.
                  </p>
                </div>

                <form onSubmit={handleSell} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Upload Photos (Max 5)
                    </label>
                    <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-5">
                      {previewImages.map((img, i) => (
                        <div
                          key={`preview-${i}`}
                          className="group relative aspect-square rounded-2xl border border-slate-200 overflow-hidden bg-slate-50"
                        >
                          <img src={img} alt="" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeUploadImage(i)}
                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow-md transition hover:scale-110"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}

                      {previewImages.length < 5 && (
                        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition hover:border-violet-500 hover:bg-violet-50/30 hover:text-violet-600">
                          <ImagePlus size={24} />
                          <span className="mt-1 text-[10px] font-bold">Add Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleMultipleImages}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700">Ad Title *</label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Royal Enfield Hunter 350 Dapper Ash, 2023"
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium outline-none focus:border-violet-500 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700">Category *</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-violet-500"
                        >
                          {CATEGORIES.filter((c) => c.name !== "All").map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700">Condition *</label>
                        <select
                          value={newCondition}
                          onChange={(e) => setNewCondition(e.target.value as ItemCondition)}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-violet-500"
                        >
                          <option value="Brand New">Brand New (Unused)</option>
                          <option value="Like New">Like New (Minimal Use)</option>
                          <option value="Good">Good (Working fine)</option>
                          <option value="Fair">Fair (Has wear & tear)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700">Price (₹) *</label>
                        <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-violet-500 focus-within:bg-white">
                          <IndianRupee size={15} className="text-slate-400" />
                          <input
                            type="number"
                            required
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            placeholder="Expected Amount"
                            className="w-full bg-transparent px-2 py-2.5 text-xs font-bold outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center sm:pt-6">
                        <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={newNegotiable}
                            onChange={(e) => setNewNegotiable(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                          />
                          Price is Negotiable
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700">Your Location *</label>
                        <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-violet-500 focus-within:bg-white">
                          <MapPin size={15} className="text-slate-400" />
                          <input
                            type="text"
                            required
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                            placeholder="e.g. Rohini Sector 7, Delhi"
                            className="w-full bg-transparent px-2 py-2.5 text-xs font-medium outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700">Contact Number</label>
                        <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-violet-500 focus-within:bg-white">
                          <Phone size={15} className="text-slate-400" />
                          <input
                            type="tel"
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            placeholder="10 digit number"
                            className="w-full bg-transparent px-2 py-2.5 text-xs font-medium outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700">Description</label>
                      <textarea
                        rows={4}
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Provide details such as purchase date, condition, accessories, reason for selling..."
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium outline-none focus:border-violet-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPublishing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-violet-600/25 transition hover:brightness-105 active:scale-95 disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Uploading to Supabase...
                      </>
                    ) : (
                      "Post Advertisement Now"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* ===================== MY ADS ===================== */}
        {page === "myads" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">My Cloud Listings</h1>
                <p className="mt-1 text-xs text-slate-500">
                  Ads associated with your verified account.
                </p>
              </div>
              <button
                onClick={() => showPage("sell")}
                className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-violet-700"
              >
                <Plus size={16} /> Post Another
              </button>
            </div>

            {ownProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <Package size={48} className="text-slate-300" />
                <h3 className="mt-4 text-base font-bold text-slate-800">No active ads posted by you</h3>
                <p className="mt-1 text-xs text-slate-500">Post your unused electronics, gadgets, or vehicles online.</p>
                <button
                  onClick={() => showPage("sell")}
                  className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white"
                >
                  Create Your First Ad
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {ownProducts.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.images[0]}
                        alt=""
                        className="h-20 w-20 rounded-xl object-cover bg-slate-100"
                      />
                      <div>
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          Active in Supabase
                        </span>
                        <h4 className="mt-1 text-sm font-bold text-slate-900">{item.title}</h4>
                        <p className="mt-0.5 text-base font-black text-violet-600">{money(item.price)}</p>
                        <p className="text-[11px] text-slate-400">
                          {item.location} • {formatTime(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openProduct(item)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteProduct(item.id)}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== WISHLIST ===================== */}
        {page === "wishlist" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Saved Wishlist</h1>
              <p className="mt-1 text-xs text-slate-500">
                Synced with your account across all devices.
              </p>
            </div>

            {favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <Heart size={44} className="text-slate-300" />
                <h3 className="mt-4 text-base font-bold text-slate-800">Your wishlist is empty</h3>
                <p className="mt-1 text-xs text-slate-500">Click the heart icon on any ad to bookmark it.</p>
                <button
                  onClick={() => showPage("home")}
                  className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
                {products
                  .filter((p) => favorites.includes(p.id))
                  .map((item) => (
                    <ProductGridCard
                      key={item.id}
                      product={item}
                      isFav={true}
                      onToggleFav={() => toggleFavorite(item.id)}
                      onOpen={() => openProduct(item)}
                    />
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== REALTIME 1-ON-1 MESSAGES ===================== */}
        {page === "messages" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Direct Private Messages</h1>
              <p className="mt-1 text-xs text-slate-500">
                1-on-1 private conversations between buyers and sellers.
              </p>
            </div>

            <div className="grid min-h-[520px] overflow-hidden rounded-3xl border border-slate-200 bg-white md:grid-cols-[320px_1fr]">
              {/* Left Column: Distinct Conversation Threads */}
              <div className="border-r border-slate-100 bg-slate-50/50">
                <div className="border-b border-slate-100 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Your Inboxes ({chatThreads.length})
                  </h3>
                </div>
                <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px]">
                  {loadingThreads ? (
                    <div className="flex flex-col items-center justify-center p-8 text-slate-400">
                      <Loader2 size={24} className="animate-spin text-violet-600" />
                      <p className="mt-2 text-xs font-bold">Loading inboxes...</p>
                    </div>
                  ) : chatThreads.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No chat conversations yet. Click &quot;Chat With Seller&quot; on any listing to begin.
                    </div>
                  ) : (
                    chatThreads.map((thread) => (
                      <button
                        key={thread.key}
                        onClick={() =>
                          setActiveChat({
                            productId: thread.productId,
                            productTitle: thread.productTitle,
                            productImage: thread.productImage,
                            price: thread.price,
                            otherUserId: thread.otherUserId,
                            otherUserName: thread.otherUserName,
                          })
                        }
                        className={`flex w-full items-center gap-3 p-3.5 text-left transition ${
                          activeChat?.productId === thread.productId &&
                          activeChat?.otherUserId === thread.otherUserId
                            ? "bg-violet-100/70"
                            : "hover:bg-slate-100"
                        }`}
                      >
                        <img
                          src={thread.productImage}
                          alt=""
                          className="h-11 w-11 rounded-xl object-cover bg-slate-100"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="truncate text-xs font-bold text-slate-900">
                              {thread.otherUserName}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              {new Date(thread.lastTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="truncate text-[11px] font-semibold text-violet-600">
                            {thread.productTitle}
                          </p>
                          <p className="truncate text-[10px] text-slate-500">
                            {thread.lastMessage}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Private Chat Box */}
              <div className="flex flex-col justify-between">
                {activeChat ? (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-100 p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={activeChat.productImage}
                          alt=""
                          className="h-10 w-10 rounded-xl object-cover bg-slate-100"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            {activeChat.otherUserName}
                          </h4>
                          <p className="text-[11px] font-semibold text-violet-600">
                            {activeChat.productTitle} • {money(activeChat.price)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto p-4 max-h-[360px]">
                      <div className="rounded-xl bg-violet-50 p-2.5 text-center text-[11px] text-violet-800">
                        🔒 Private chat with <strong>{activeChat.otherUserName}</strong> for <strong>{activeChat.productTitle}</strong>.
                      </div>

                      {messages.map((msg) => {
                        const isMe = user && msg.sender_id === user.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs ${
                                isMe
                                  ? "rounded-br-none bg-violet-600 text-white"
                                  : "rounded-bl-none bg-slate-100 text-slate-800"
                              }`}
                            >
                              <p className="leading-relaxed">{msg.content}</p>
                              <span
                                className={`mt-1 block text-[9px] ${
                                  isMe ? "text-violet-200 text-right" : "text-slate-400"
                                }`}
                              >
                                {new Date(msg.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <form onSubmit={sendChat} className="flex gap-2 border-t border-slate-100 p-3">
                      <input
                        value={chatText}
                        onChange={(e) => setChatText(e.target.value)}
                        placeholder={`Message ${activeChat.otherUserName}...`}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-violet-500 focus:bg-white"
                      />
                      <button
                        type="submit"
                        disabled={!chatText.trim() || sendingMsg}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:opacity-40"
                      >
                        {sendingMsg ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-slate-400">
                    <MessageCircle size={40} className="text-slate-300" />
                    <p className="mt-2 text-xs font-semibold text-slate-600">No chat selected</p>
                    <p className="mt-1 text-[11px] text-slate-400">Choose a conversation from the left to start messaging.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================== USER PROFILE ===================== */}
        {page === "profile" && (
          <div className="mx-auto max-w-xl space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">My Account</h1>
              <p className="mt-1 text-xs text-slate-500">
                Your authenticated profile details in Supabase.
              </p>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-2xl font-black text-white">
                  {profileName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{profileName}</h3>
                    {isAdminUser && (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-700">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{user?.email || "No email linked"}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Display Name</label>
                <input
                  type="text"
                  disabled
                  value={profileName}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-xs font-semibold text-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Phone</label>
                <input
                  type="text"
                  disabled
                  value={profilePhone || "Not specified"}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-xs font-semibold text-slate-600 outline-none"
                />
              </div>

              {isAdminUser && (
                <div className="pt-2">
                  <Link
                    href="/admin/"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-slate-800"
                  >
                    <ShieldAlert size={16} className="text-amber-400" /> Open Root Admin Dashboard
                  </Link>
                </div>
              )}

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                >
                  <LogOut size={16} /> Sign Out of SELDOL
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation Bar for Mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white/95 py-2 backdrop-blur-lg md:hidden">
        {[
          { label: "Home", p: "home" as PageName, icon: LayoutGrid },
          { label: "Wishlist", p: "wishlist" as PageName, icon: Heart, count: favorites.length },
          { label: "Sell", p: "sell" as PageName, icon: Plus, isAction: true },
          { label: "Chats", p: "messages" as PageName, icon: MessageCircle },
          { label: "Profile", p: user ? ("profile" as PageName) : null, href: user ? null : "/login/", icon: UserRound },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = item.p ? page === item.p : false;

          if (item.isAction) {
            return (
              <button
                key={item.label}
                onClick={() => showPage(item.p!)}
                className="flex flex-col items-center justify-center text-[10px] font-bold text-white"
              >
                <div className="flex h-10 w-10 -translate-y-2 items-center justify-center rounded-full bg-violet-600 shadow-lg shadow-violet-600/30">
                  <Icon size={20} strokeWidth={3} />
                </div>
                <span className="-translate-y-1 text-slate-800">{item.label}</span>
              </button>
            );
          }

          if (item.href) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center text-[10px] font-bold text-slate-400"
              >
                <Icon size={20} />
                <span className="mt-1">{item.label}</span>
              </Link>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => showPage(item.p!)}
              className={`relative flex flex-col items-center justify-center text-[10px] font-bold transition ${
                isActive ? "text-violet-600" : "text-slate-400"
              }`}
            >
              <Icon size={20} />
              <span className="mt-1">{item.label}</span>
              {Boolean(item.count) && (
                <span className="absolute -top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] text-white">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Floating Global Toast */}
      {notice && (
        <div className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl md:bottom-6">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Mobile Spacer for Fixed Bottom Nav */}
      <div className="h-16 md:hidden" />
    </div>
  );
}

// ----------------- CARDS -----------------

function ProductGridCard({
  product,
  isFav,
  onToggleFav,
  onOpen,
}: {
  product: Product;
  isFav: boolean;
  onToggleFav: () => void;
  onOpen: () => void;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-950/5">
      <div className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden bg-slate-100" onClick={onOpen}>
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {product.isFeatured && (
          <span className="absolute left-2.5 top-2.5 rounded-lg bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase text-amber-950 shadow-sm">
            FEATURED
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav();
          }}
          className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition ${
            isFav ? "bg-rose-500 text-white" : "bg-white/80 text-slate-700 hover:bg-white"
          }`}
        >
          <Heart size={14} fill={isFav ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between p-3.5">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">{product.category}</span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
              {product.condition}
            </span>
          </div>
          <h3
            onClick={onOpen}
            className="mt-1 line-clamp-1 cursor-pointer text-xs font-bold text-slate-800 transition hover:text-violet-600"
          >
            {product.title}
          </h3>
          <p className="mt-1.5 text-base font-black text-slate-900">{money(product.price)}</p>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[10px] text-slate-400">
          <span className="truncate max-w-[90px]">{product.location.split(",")[0]}</span>
          <span>{formatTime(product.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function ProductListCard({
  product,
  isFav,
  onToggleFav,
  onOpen,
}: {
  product: Product;
  isFav: boolean;
  onToggleFav: () => void;
  onOpen: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-3.5 transition hover:border-violet-300 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex cursor-pointer items-center gap-3.5" onClick={onOpen}>
        <img
          src={product.images[0]}
          alt=""
          className="h-20 w-20 shrink-0 rounded-xl object-cover bg-slate-100"
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-violet-600">{product.category}</span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] font-bold text-slate-500">{product.condition}</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">{product.title}</h3>
          <p className="mt-0.5 text-base font-black text-slate-900">{money(product.price)}</p>
          <p className="text-[11px] text-slate-400">{product.location}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFav}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
            isFav ? "border-rose-200 bg-rose-50 text-rose-500" : "border-slate-200 text-slate-600"
          }`}
        >
          <Heart size={16} fill={isFav ? "currentColor" : "none"} />
        </button>
        <button
          onClick={onOpen}
          className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
