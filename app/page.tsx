"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";

import {
  Search,
  Heart,
  MessageCircle,
  UserRound,
  Plus,
  MapPin,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft,
  X,
  Upload,
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
  Headphones,
  Menu,
  Trash2,
  ArrowLeft,
  Send,
  Phone,
  CheckCircle2,
  Sparkles,
  Clock3,
  IndianRupee,
  Settings,
  Star,
  BadgeCheck,
  ImagePlus,
  Zap,
  MessageSquare,
  Share2,
  Filter,
  Check,
  CircleUserRound,
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
  title: string;
  price: number;
  isNegotiable?: boolean;
  category: string;
  condition: ItemCondition;
  location: string;
  description: string;
  images: string[];
  seller: string;
  sellerRating?: number;
  phone: string;
  isFeatured?: boolean;
  createdAt: number;
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

const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-1",
    title: "iPhone 13 • 128GB (Starlight White)",
    price: 28500,
    isNegotiable: true,
    category: "Mobiles",
    condition: "Like New",
    location: "Connaught Place, Delhi",
    description:
      "Original box, bill & charging cable available. Battery health 87%. Scratchless condition, tempered glass installed from day 1.",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=900&q=85",
    ],
    seller: "Tech Store Delhi",
    sellerRating: 4.8,
    phone: "9876543210",
    isFeatured: true,
    createdAt: Date.now() - 1000 * 60 * 35,
  },
  {
    id: "demo-2",
    title: "Royal Enfield Classic 350 - Stealth Black",
    price: 125000,
    isNegotiable: false,
    category: "Vehicles",
    condition: "Good",
    location: "Sector 29, Gurugram",
    description:
      "Single owner, 2021 model, 16,500 kms driven. Regularly serviced at authorized showroom. Both keys available, insurance valid till next year.",
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85",
    ],
    seller: "Aman Sharma",
    sellerRating: 4.9,
    phone: "9811122233",
    isFeatured: true,
    createdAt: Date.now() - 1000 * 60 * 120,
  },
  {
    id: "demo-3",
    title: "Minimalist Wooden Study & Work Desk",
    price: 3499,
    isNegotiable: true,
    category: "Furniture",
    condition: "Like New",
    location: "Rohini, Delhi",
    description:
      "Ergonomic engineered wood study table with side book shelves. Moving out of Delhi, so selling quickly.",
    images: [
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=900&q=85",
    ],
    seller: "Rohit Verma",
    sellerRating: 4.6,
    phone: "",
    createdAt: Date.now() - 1000 * 60 * 300,
  },
  {
    id: "demo-4",
    title: "HP Pavilion Gaming Laptop (Ryzen 5 / 16GB / RTX 3050)",
    price: 42000,
    isNegotiable: true,
    category: "Electronics",
    condition: "Good",
    location: "Sector 62, Noida",
    description:
      "Smooth performance for editing and coding. Upgraded to 16GB RAM. 512GB NVMe SSD, original 150W charger included.",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
    ],
    seller: "Digital Hub",
    sellerRating: 4.7,
    phone: "9899001122",
    createdAt: Date.now() - 1000 * 60 * 500,
  },
  {
    id: "demo-5",
    title: "Nike Air Jordan Retro High (Size UK 9)",
    price: 4200,
    isNegotiable: false,
    category: "Fashion",
    condition: "Brand New",
    location: "Saket, Delhi",
    description:
      "Brand new with tags, unopened box. Bought from retail store, selling because size is slightly big.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    ],
    seller: "Sneaker Head",
    sellerRating: 5.0,
    phone: "",
    createdAt: Date.now() - 1000 * 60 * 700,
  },
  {
    id: "demo-6",
    title: "Canon EOS 200D II DSLR with 18-55mm STM Lens",
    price: 36000,
    isNegotiable: true,
    category: "Electronics",
    condition: "Like New",
    location: "Faridabad",
    description:
      "Barely 2,000 shutter count! Perfect camera for YouTube, 4K video & portrait photography. Includes bag, strap, battery and 64GB SD card.",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
    ],
    seller: "Karan Lens World",
    sellerRating: 4.9,
    phone: "9871100223",
    isFeatured: true,
    createdAt: Date.now() - 1000 * 60 * 1200,
  },
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
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All");
  const [conditionFilter, setConditionFilter] = useState<string>("All");
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Nav & Toast
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");

  // Sell Item Form
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newNegotiable, setNewNegotiable] = useState(true);
  const [newCategory, setNewCategory] = useState("Mobiles");
  const [newCondition, setNewCondition] = useState<ItemCondition>("Like New");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newImages, setNewImages] = useState<string[]>([]);

  // User Profile
  const [profileName, setProfileName] = useState("Sameer Malik");
  const [profileCity, setProfileCity] = useState("Delhi, India");
  const [profilePhone, setProfilePhone] = useState("9953023531");
  const [profileSaved, setProfileSaved] = useState(false);

  // In-app Chat Simulation
  const [chatProduct, setChatProduct] = useState<Product | null>(null);
  const [chatText, setChatText] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { id: string; productId: string; sender: string; text: string; time: number }[]
  >([]);

  // LocalStorage sync
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("seldol_products_v2");
      const savedFavorites = localStorage.getItem("seldol_favorites_v2");
      const savedProfile = localStorage.getItem("seldol_profile_v2");
      const savedChats = localStorage.getItem("seldol_chats_v2");

      if (savedProducts) {
        const parsed = JSON.parse(savedProducts) as Product[];
        setProducts([...parsed, ...DEMO_PRODUCTS]);
      }
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites) as string[]);
      }
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.name) setProfileName(profile.name);
        if (profile.city) setProfileCity(profile.city);
        if (profile.phone) setProfilePhone(profile.phone);
      }
      if (savedChats) {
        setChatMessages(JSON.parse(savedChats));
      }
    } catch {
      // safe fallback
    }
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const ownProducts = products.filter((p) => !p.id.startsWith("demo-"));

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFavorite = (productId: string) => {
    const updated = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    setFavorites(updated);
    try {
      localStorage.setItem("seldol_favorites_v2", JSON.stringify(updated));
    } catch {}

    setNotice(
      updated.includes(productId) ? "Added to Wishlist ❤️" : "Removed from Wishlist"
    );
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

    if (newImages.length + files.length > 5) {
      setNotice("You can upload a maximum of 5 images");
      return;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setNotice("Only image files are allowed");
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        setNotice("Each image must be under 3 MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setNewImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeUploadImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSell = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle.trim() || !newPrice || !newLocation.trim()) {
      setNotice("Please fill in all required fields!");
      return;
    }

    const priceNum = Number(newPrice);
    if (priceNum <= 0 || isNaN(priceNum)) {
      setNotice("Please enter a valid price");
      return;
    }

    const fallbackImage =
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=85";

    const product: Product = {
      id: `user-${Date.now()}`,
      title: newTitle.trim(),
      price: priceNum,
      isNegotiable: newNegotiable,
      category: newCategory,
      condition: newCondition,
      location: newLocation.trim(),
      description: newDescription.trim() || "No detailed description provided.",
      images: newImages.length > 0 ? newImages : [fallbackImage],
      seller: profileName,
      sellerRating: 5.0,
      phone: newPhone.trim() || profilePhone,
      isFeatured: false,
      createdAt: Date.now(),
    };

    const updatedOwn = [product, ...ownProducts];
    try {
      localStorage.setItem("seldol_products_v2", JSON.stringify(updatedOwn));
    } catch {
      setNotice("Local storage full! Try uploading smaller images.");
      return;
    }

    setProducts([product, ...products]);
    // Reset Form
    setNewTitle("");
    setNewPrice("");
    setNewLocation("");
    setNewDescription("");
    setNewPhone("");
    setNewImages([]);
    setSelectedProduct(product);
    setPage("details");
    setNotice("Ad posted successfully! 🎉");
  };

  const deleteProduct = (id: string) => {
    const updatedOwn = ownProducts.filter((p) => p.id !== id);
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    try {
      localStorage.setItem("seldol_products_v2", JSON.stringify(updatedOwn));
    } catch {}
    setNotice("Listing removed");
  };

  const saveProfile = (e: FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        "seldol_profile_v2",
        JSON.stringify({
          name: profileName,
          city: profileCity,
          phone: profilePhone,
        })
      );
    } catch {}
    setProfileSaved(true);
    setNotice("Profile saved successfully ✨");
  };

  const startChat = (product: Product) => {
    setChatProduct(product);
    setPage("messages");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sendChat = (e: FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !chatProduct) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      productId: chatProduct.id,
      sender: profileName,
      text: chatText.trim(),
      time: Date.now(),
    };

    let updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setChatText("");

    // Simulate smart seller reply
    setTimeout(() => {
      const sellerReplies = [
        "Yes, it is available! When would you like to check it?",
        "Price is slightly negotiable if you pick it up today.",
        "Sure! You can inspect the condition in person anytime after 5 PM.",
      ];
      const randomReply =
        sellerReplies[Math.floor(Math.random() * sellerReplies.length)];

      const replyMsg = {
        id: `reply-${Date.now()}`,
        productId: chatProduct.id,
        sender: chatProduct.seller,
        text: randomReply,
        time: Date.now(),
      };
      const finalMsgs = [...updated, replyMsg];
      setChatMessages(finalMsgs);
      try {
        localStorage.setItem("seldol_chats_v2", JSON.stringify(finalMsgs));
      } catch {}
    }, 1200);

    try {
      localStorage.setItem("seldol_chats_v2", JSON.stringify(updated));
    } catch {}
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
      {/* Top Banner */}
      <div className="bg-slate-950 px-4 py-2 text-center text-xs font-medium text-slate-300">
        <span className="mr-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE MARKETPLACE
        </span>
        Buy & Sell pre-loved verified products directly with zero middleman fees.
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Logo */}
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

          {/* Quick Search Header (Desktop) */}
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

          {/* Desktop Actions */}
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
              <span>My Ads</span>
            </button>

            <button
              onClick={() => showPage("profile")}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50/50"
            >
              <UserRound size={17} className="text-slate-600" />
              <span>{profileName.split(" ")[0]}</span>
            </button>

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
              <button
                onClick={() => showPage("profile")}
                className="col-span-2 flex items-center gap-2 rounded-xl border border-slate-100 p-3 hover:bg-slate-50"
              >
                <UserRound size={18} className="text-slate-600" /> Profile: {profileName}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Body */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* ===================== HOME PAGE ===================== */}
        {page === "home" && (
          <div className="space-y-8">
            {/* Hero Banner (Only shown if no active filter) */}
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

            {/* Categories Carousel */}
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
                      onClick={() => setCategory(cat.name)}
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

            {/* Filter & Search Bar */}
            <div id="browse-section" className="space-y-4">
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                {/* Search & Location inputs */}
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

                {/* Filter dropdowns */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  {/* Condition Filter */}
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

                  {/* Max Budget */}
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

                  {/* Sorting */}
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                  </select>

                  {/* View Mode Toggle */}
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

              {/* Products Feed */}
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                  <Package size={48} className="text-slate-300" />
                  <h3 className="mt-4 text-base font-bold text-slate-800">No items match your criteria</h3>
                  <p className="mt-1 text-xs text-slate-500">Try loosening your search keywords or price filters.</p>
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
              {/* Left Column: Image Slider & Description */}
              <div className="space-y-6">
                {/* Images */}
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

                  {/* Thumbnail Row */}
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

                {/* Details Accordion / Specs */}
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

              {/* Right Column: Pricing & Seller Quick Action */}
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
                          ✓ Price is slightly negotiable
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

                  {/* Seller Card */}
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
                            {selectedProduct.sellerRating || 4.8}
                          </span>
                          <span>•</span>
                          <span>Verified Seller</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="space-y-2.5">
                    {selectedProduct.seller !== profileName && (
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

                {/* Safety advice */}
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

            <div>
              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Post Free Advertisement</h1>
              <p className="mt-1 text-xs text-slate-500">
                Reach thousands of genuine buyers across your city in minutes.
              </p>
            </div>

            <form onSubmit={handleSell} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {/* Photo Upload Area */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Upload Photos (Max 5)
                </label>
                <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {newImages.map((img, i) => (
                    <div key={i} className="group relative aspect-square rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
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

                  {newImages.length < 5 && (
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

              {/* Title & Category */}
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

                {/* Price & Negotiable Checkbox */}
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

                {/* Location & Phone */}
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
                    <label className="block text-xs font-bold text-slate-700">Phone for WhatsApp/Calls</label>
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

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    rows={4}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Provide details such as purchase date, condition, included accessories, reason for selling..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium outline-none focus:border-violet-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-violet-600/25 transition hover:brightness-105 active:scale-95"
              >
                Post Advertisement Now
              </button>
            </form>
          </div>
        )}

        {/* ===================== MY ADS ===================== */}
        {page === "myads" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">My Listings</h1>
                <p className="mt-1 text-xs text-slate-500">
                  Manage the items you've posted on this device.
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
                <h3 className="mt-4 text-base font-bold text-slate-800">You haven't posted any ads yet</h3>
                <p className="mt-1 text-xs text-slate-500">Turn your unused electronics, vehicles, or items into quick cash.</p>
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
                          Active Listing
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
                Items you've bookmarked for later consideration.
              </p>
            </div>

            {favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <Heart size={44} className="text-slate-300" />
                <h3 className="mt-4 text-base font-bold text-slate-800">Your wishlist is empty</h3>
                <p className="mt-1 text-xs text-slate-500">Click the heart icon on any ad to keep it here.</p>
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

        {/* ===================== MESSAGES (CHAT) ===================== */}
        {page === "messages" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Direct In-App Messages</h1>
              <p className="mt-1 text-xs text-slate-500">
                Chat securely with sellers and buyers in real-time demo mode.
              </p>
            </div>

            <div className="grid min-h-[500px] overflow-hidden rounded-3xl border border-slate-200 bg-white md:grid-cols-[300px_1fr]">
              {/* Left Contacts List */}
              <div className="border-r border-slate-100 bg-slate-50/50">
                <div className="border-b border-slate-100 p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Conversations
                  </h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {products.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setChatProduct(p)}
                      className={`flex w-full items-center gap-3 p-3.5 text-left transition ${
                        chatProduct?.id === p.id ? "bg-violet-100/60" : "hover:bg-slate-100"
                      }`}
                    >
                      <img src={p.images[0]} alt="" className="h-10 w-10 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-xs font-bold text-slate-900">{p.seller}</p>
                          <span className="text-[10px] text-slate-400">Online</span>
                        </div>
                        <p className="truncate text-[11px] text-slate-500">{p.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat View */}
              <div className="flex flex-col justify-between">
                {chatProduct ? (
                  <>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={chatProduct.images[0]}
                          alt=""
                          className="h-10 w-10 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{chatProduct.seller}</h4>
                          <p className="text-[11px] font-semibold text-violet-600">
                            {chatProduct.title} • {money(chatProduct.price)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => openProduct(chatProduct)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
                      >
                        View Ad
                      </button>
                    </div>

                    {/* Chat Bubble Area */}
                    <div className="flex-1 space-y-3 overflow-y-auto p-4 max-h-[350px]">
                      <div className="rounded-xl bg-violet-50 p-3 text-center text-[11px] text-violet-800">
                        🔒 Safe Chat initiated for <strong>{chatProduct.title}</strong>. Never send advance money before checking the item.
                      </div>

                      {chatMessages
                        .filter((m) => m.productId === chatProduct.id)
                        .map((msg) => {
                          const isMe = msg.sender === profileName;
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
                                <p className="leading-relaxed">{msg.text}</p>
                                <span
                                  className={`mt-1 block text-[9px] ${
                                    isMe ? "text-violet-200 text-right" : "text-slate-400"
                                  }`}
                                >
                                  {new Date(msg.time).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Input */}
                    <form onSubmit={sendChat} className="flex gap-2 border-t border-slate-100 p-3">
                      <input
                        value={chatText}
                        onChange={(e) => setChatText(e.target.value)}
                        placeholder="Type message to seller..."
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs outline-none focus:border-violet-500 focus:bg-white"
                      />
                      <button
                        type="submit"
                        disabled={!chatText.trim()}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:opacity-40"
                      >
                        <Send size={16} />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-slate-400">
                    <MessageCircle size={36} />
                    <p className="mt-2 text-xs font-semibold">Select an item conversation from the left.</p>
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
              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Seller Profile</h1>
              <p className="mt-1 text-xs text-slate-500">
                Update your public name, primary city, and verified contact number.
              </p>
            </div>

            <form onSubmit={saveProfile} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-2xl font-black text-white">
                  {profileName[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{profileName}</h3>
                  <p className="text-xs text-slate-400">{profileCity}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Display Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Primary City / State</label>
                <input
                  type="text"
                  required
                  value={profileCity}
                  onChange={(e) => setProfileCity(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Contact Number</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-violet-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-violet-600 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-violet-600/20 hover:bg-violet-700 active:scale-95"
              >
                Save Profile
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Mobile Bottom Floating Nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white/95 py-2 backdrop-blur-lg md:hidden">
        {[
          { label: "Home", p: "home" as PageName, icon: LayoutGrid },
          { label: "Wishlist", p: "wishlist" as PageName, icon: Heart, count: favorites.length },
          { label: "Sell", p: "sell" as PageName, icon: Plus, isAction: true },
          { label: "Chats", p: "messages" as PageName, icon: MessageCircle },
          { label: "Profile", p: "profile" as PageName, icon: UserRound },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = page === item.p;

          if (item.isAction) {
            return (
              <button
                key={item.label}
                onClick={() => showPage(item.p)}
                className="flex flex-col items-center justify-center text-[10px] font-bold text-white"
              >
                <div className="flex h-10 w-10 -translate-y-2 items-center justify-center rounded-full bg-violet-600 shadow-lg shadow-violet-600/30">
                  <Icon size={20} strokeWidth={3} />
                </div>
                <span className="-translate-y-1 text-slate-800">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => showPage(item.p)}
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
    </div>
  );
}

// ----------------- SUB COMPONENTS -----------------

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
      {/* Thumbnail */}
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

      {/* Content */}
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
