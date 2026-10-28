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
  Camera,
  Upload,
  Smartphone,
  CarFront,
  Laptop,
  Armchair,
  Shirt,
  Watch,
  LayoutGrid,
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
  LogOut,
  Star,
  BadgeCheck,
  ImagePlus,
  Zap,
  MessageSquare,
  Bell,
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

type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  location: string;
  description: string;
  image: string;
  seller: string;
  phone: string;
  createdAt: number;
};

const CATEGORIES = [
  { name: "All", icon: LayoutGrid },
  { name: "Mobiles", icon: Smartphone },
  { name: "Motorcycles", icon: CarFront },
  { name: "Electronics", icon: Laptop },
  { name: "Furniture", icon: Armchair },
  { name: "Fashion", icon: Shirt },
  { name: "Accessories", icon: Watch },
];

const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-1",
    title: "iPhone 13 • 128GB",
    price: 28500,
    category: "Mobiles",
    location: "Delhi",
    description:
      "Well-maintained iPhone 13 with 128GB storage. Clean display, working cameras and Face ID. Box availability and battery health can be confirmed with the seller.",
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=85",
    seller: "Tech Store",
    phone: "",
    createdAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: "demo-2",
    title: "Royal Enfield Classic 350",
    price: 125000,
    category: "Motorcycles",
    location: "Gurugram",
    description:
      "Pre-owned Royal Enfield Classic 350. Contact the seller for the model year, kilometres driven, service history and registration details.",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85",
    seller: "Aman",
    phone: "",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: "demo-3",
    title: "Modern Study Table",
    price: 3500,
    category: "Furniture",
    location: "Rohini, Delhi",
    description:
      "A practical study table for home or office. Pre-owned, with a modern design. Ask the seller about dimensions and condition before purchasing.",
    image:
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=900&q=85",
    seller: "Rohit",
    phone: "",
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: "demo-4",
    title: "HP Pavilion Laptop",
    price: 32000,
    category: "Electronics",
    location: "Noida",
    description:
      "Pre-owned HP Pavilion laptop for everyday work and study. Contact the seller for the exact processor, RAM, storage, battery condition and warranty details.",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
    seller: "Digital Hub",
    phone: "",
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
  },
  {
    id: "demo-5",
    title: "Premium Everyday Sneakers",
    price: 1200,
    category: "Fashion",
    location: "Delhi",
    description:
      "Pre-owned casual sneakers. Please confirm size, condition and any visible wear with the seller before making a deal.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
    seller: "Fashion Finds",
    phone: "",
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: "demo-6",
    title: "Canon DSLR Camera",
    price: 22000,
    category: "Electronics",
    location: "Faridabad",
    description:
      "Pre-owned Canon DSLR camera. Contact the seller for the exact model, shutter count, included lens, accessories and working condition.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
    seller: "Camera Point",
    phone: "",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: "demo-7",
    title: "City Commuter Bicycle",
    price: 4500,
    category: "Accessories",
    location: "Dwarka, Delhi",
    description:
      "Pre-owned bicycle suitable for everyday commuting and short rides. Ask about the frame size, gears, brakes and maintenance history.",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=85",
    seller: "Vikas",
    phone: "",
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
  },
  {
    id: "demo-8",
    title: "Wooden Bookshelf",
    price: 2800,
    category: "Furniture",
    location: "Pitampura, Delhi",
    description:
      "Pre-owned wooden bookshelf for your home, study or office. Confirm dimensions, number of shelves and pickup arrangements with the seller.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=85",
    seller: "Home Essentials",
    phone: "",
    createdAt: Date.now() - 1000 * 60 * 60 * 40,
  },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const formatTime = (timestamp: number) => {
  const hours = Math.max(
    0,
    Math.floor((Date.now() - timestamp) / (1000 * 60 * 60)),
  );

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

export default function HomePage() {
  const [page, setPage] = useState<PageName>("home");
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [maxPrice, setMaxPrice] = useState("All");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("Mobiles");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newImage, setNewImage] = useState("");
  const [imageName, setImageName] = useState("");

  const [profileName, setProfileName] = useState("SELDOL Member");
  const [profileCity, setProfileCity] = useState("India");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  const [chatProduct, setChatProduct] = useState<Product | null>(null);
  const [chatText, setChatText] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { id: string; productId: string; sender: string; text: string; time: number }[]
  >([]);

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("seldol_products");
      const savedFavorites = localStorage.getItem("seldol_favorites");
      const savedProfile = localStorage.getItem("seldol_profile");
      const savedChats = localStorage.getItem("seldol_chats");

      if (savedProducts) {
        const parsed = JSON.parse(savedProducts) as Product[];
        setProducts([...parsed, ...DEMO_PRODUCTS]);
      }

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites) as string[]);
      }

      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setProfileName(profile.name || "SELDOL Member");
        setProfileCity(profile.city || "India");
        setProfilePhone(profile.phone || "");
      }

      if (savedChats) {
        setChatMessages(JSON.parse(savedChats));
      }
    } catch {
      // Continue with demo data if browser storage is unavailable.
    }
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2800);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const ownProducts = products.filter(
    (product) => !product.id.startsWith("demo-"),
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "All") {
      result = result.filter((product) => product.category === category);
    }

    if (search.trim()) {
      const query = search.toLowerCase().trim();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      );
    }

    if (location.trim()) {
      result = result.filter((product) =>
        product.location.toLowerCase().includes(location.toLowerCase().trim()),
      );
    }

    if (maxPrice !== "All") {
      result = result.filter((product) => product.price <= Number(maxPrice));
    }

    if (sort === "low") result.sort((a, b) => a.price - b.price);
    if (sort === "high") result.sort((a, b) => b.price - a.price);
    if (sort === "newest") result.sort((a, b) => b.createdAt - a.createdAt);

    return result;
  }, [products, category, search, location, maxPrice, sort]);

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
      localStorage.setItem("seldol_favorites", JSON.stringify(updated));
    } catch {
      // Favorites still work for the current session.
    }

    setNotice(
      updated.includes(productId)
        ? "Added to your wishlist"
        : "Removed from your wishlist",
    );
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setPage("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setNotice("Image size must be 2 MB or less");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setNewImage(reader.result);
        setImageName(file.name);
      }
    };

    reader.onerror = () => setNotice("Unable to read this image");

    reader.readAsDataURL(file);
  };

  const handleSell = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTitle.trim() || !newPrice || !newLocation.trim()) {
      setNotice("Please complete all required fields");
      return;
    }

    if (Number(newPrice) <= 0 || !Number.isFinite(Number(newPrice))) {
      setNotice("Enter a valid price");
      return;
    }

    const product: Product = {
      id: `user-${Date.now()}`,
      title: newTitle.trim(),
      price: Number(newPrice),
      category: newCategory,
      location: newLocation.trim(),
      description: newDescription.trim() || "No description provided.",
      image:
        newImage ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
      seller: profileName,
      phone: newPhone.trim() || profilePhone,
      createdAt: Date.now(),
    };

    const updatedOwn = [product, ...ownProducts];

    try {
      localStorage.setItem("seldol_products", JSON.stringify(updatedOwn));
    } catch {
      setNotice("Storage is full. Try a smaller image.");
      return;
    }

    setProducts([product, ...products]);
    setNewTitle("");
    setNewPrice("");
    setNewCategory("Mobiles");
    setNewLocation("");
    setNewDescription("");
    setNewPhone("");
    setNewImage("");
    setImageName("");

    setSelectedProduct(product);
    setPage("details");
    setNotice("Your listing has been created!");
  };

  const deleteProduct = (id: string) => {
    const updatedOwn = ownProducts.filter((product) => product.id !== id);
    const updatedProducts = products.filter((product) => product.id !== id);

    setProducts(updatedProducts);

    try {
      localStorage.setItem("seldol_products", JSON.stringify(updatedOwn));
    } catch {
      // Update remains available in the current session.
    }

    setNotice("Listing deleted");
  };

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      localStorage.setItem(
        "seldol_profile",
        JSON.stringify({
          name: profileName,
          city: profileCity,
          phone: profilePhone,
        }),
      );
    } catch {
      // Continue with the in-memory profile.
    }

    setProfileSaved(true);
    setNotice("Profile saved successfully");
  };

  const startChat = (product: Product) => {
    setChatProduct(product);
    setPage("messages");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sendChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!chatText.trim() || !chatProduct) return;

    const message = {
      id: `msg-${Date.now()}`,
      productId: chatProduct.id,
      sender: profileName,
      text: chatText.trim(),
      time: Date.now(),
    };

    const updated = [...chatMessages, message];

    setChatMessages(updated);
    setChatText("");

    try {
      localStorage.setItem("seldol_chats", JSON.stringify(updated));
    } catch {
      // Keep the conversation in the current session.
    }
  };

  const startWhatsApp = (product: Product) => {
    const digits = product.phone.replace(/\D/g, "");

    if (!digits) {
      setNotice("This demo listing has no seller phone number");
      return;
    }

    const phone = digits.length === 10 ? `91${digits}` : digits;
    const message = `Hi, I'm interested in your "${product.title}" listed on SELDOL for ${money(product.price)}. Is it available?`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const startCall = (product: Product) => {
    const digits = product.phone.replace(/\D/g, "");

    if (!digits) {
      setNotice("This demo listing has no seller phone number");
      return;
    }

    window.location.href = `tel:${digits}`;
  };

  const PageHeading = ({
    eyebrow,
    title,
    subtitle,
  }: {
    eyebrow: string;
    title: string;
    subtitle: string;
  }) => (
    <div className="mb-7">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
    </div>
  );

  const ProductCard = ({ product }: { product: Product }) => {
    const isFavorite = favorites.includes(product.id);

    return (
      <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-900/[0.06]">
        <div
          className="relative cursor-pointer overflow-hidden bg-slate-100"
          onClick={() => openProduct(product)}
        >
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>

          <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm">
            {product.category}
          </span>

          <button
            type="button"
            aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(event) => {
              event.stopPropagation();
              toggleFavorite(product.id);
            }}
            className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 shadow-sm transition ${
              isFavorite
                ? "bg-rose-500 text-white"
                : "bg-white/95 text-slate-600 hover:bg-rose-50 hover:text-rose-500"
            }`}
          >
            <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3
              onClick={() => openProduct(product)}
              className="line-clamp-2 min-h-[40px] cursor-pointer text-sm font-bold leading-5 text-slate-900 transition hover:text-violet-700"
            >
              {product.title}
            </h3>
          </div>

          <p className="text-xl font-extrabold tracking-tight text-slate-950">
            {money(product.price)}
          </p>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span className="flex min-w-0 items-center gap-1 truncate">
              <MapPin size={13} className="shrink-0 text-violet-500" />
              <span className="truncate">{product.location}</span>
            </span>
            <span className="shrink-0">{formatTime(product.createdAt)}</span>
          </div>

          <button
            type="button"
            onClick={() => openProduct(product)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white transition hover:bg-violet-700"
          >
            View details
            <ChevronRight size={15} />
          </button>
        </div>
      </article>
    );
  };

  const EmptyState = ({
    icon: Icon,
    title,
    description,
    buttonText,
    onClick,
  }: {
    icon: typeof Package;
    title: string;
    description: string;
    buttonText?: string;
    onClick?: () => void;
  }) => (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
        <Icon size={29} />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>

      {buttonText && onClick && (
        <button
          type="button"
          onClick={onClick}
          className="mt-6 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
        >
          {buttonText}
        </button>
      )}
    </div>
  );

  const navItems: {
    name: string;
    page: PageName;
    icon: typeof Package;
  }[] = [
    { name: "Home", page: "home", icon: LayoutGrid },
    { name: "My Ads", page: "myads", icon: Package },
    { name: "Wishlist", page: "wishlist", icon: Heart },
    { name: "Messages", page: "messages", icon: MessageCircle },
    { name: "Profile", page: "profile", icon: UserRound },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      {/* Announcement strip */}
      <div className="bg-slate-950 px-4 py-2 text-center text-[11px] font-medium tracking-wide text-slate-200 sm:text-xs">
        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
        A smarter way to buy and sell pre-loved products across India
        <span className="ml-2 hidden text-violet-300 sm:inline">
          Discover your next great deal →
        </span>
      </div>

      {/* Main navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => showPage("home")}
            className="flex shrink-0 items-center gap-2.5"
            aria-label="SELDOL home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-600/20">
              <ShoppingBag size={21} strokeWidth={2.4} />
            </span>
            <span className="text-[23px] font-black tracking-[-1.3px] text-slate-950">
              SEL<span className="text-violet-600">DOL</span>
              <span className="ml-1 align-top text-[9px] font-bold tracking-normal text-slate-400">
                INDIA
              </span>
            </span>
          </button>

          <div className="mx-auto hidden max-w-[570px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-violet-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100 md:flex">
            <Search size={19} className="shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                if (page !== "home") setPage("home");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") showPage("home");
              }}
              placeholder="Search mobiles, laptops, bikes..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="text-slate-400 hover:text-slate-800"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => showPage("wishlist")}
              className="relative hidden h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 sm:flex"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {favorites.length > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[9px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => showPage("messages")}
              className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 sm:flex"
              aria-label="Messages"
            >
              <MessageCircle size={20} />
            </button>

            <button
              type="button"
              onClick={() => showPage("profile")}
              className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-violet-200 hover:text-violet-700 sm:flex"
              aria-label="Profile"
            >
              <UserRound size={19} />
            </button>

            <button
              type="button"
              onClick={() => showPage("sell")}
              className="flex h-10 items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-3.5 text-xs font-bold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:gap-2 sm:px-5 sm:text-sm"
            >
              <Plus size={17} />
              <span>Sell Item</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenu(!mobileMenu)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden"
              aria-label="Open menu"
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="px-4 pb-3 md:hidden">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-violet-300 focus-within:bg-white">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                if (page !== "home") setPage("home");
              }}
              placeholder="Search products..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() => showPage(item.page)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-semibold ${
                      page === item.page
                        ? "bg-violet-50 text-violet-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={17} />
                    {item.name}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => showPage("sell")}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-3 py-3 text-left text-sm font-bold text-white"
              >
                <Plus size={17} />
                Sell a product
              </button>
            </div>
          </div>
        )}

        {/* Desktop secondary navigation */}
        <div className="hidden border-t border-slate-100 md:block">
          <nav className="mx-auto flex max-w-[1440px] items-center gap-7 px-6 lg:px-10">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => showPage(item.page)}
                  className={`relative flex items-center gap-2 py-3.5 text-xs font-semibold transition ${
                    page === item.page
                      ? "text-violet-700"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Icon size={15} />
                  {item.name}
                  {page === item.page && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-violet-600" />
                  )}
                </button>
              );
            })}

            <span className="ml-auto flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <ShieldCheck size={15} className="text-emerald-500" />
              Buy smarter. Sell easier.
            </span>
          </nav>
        </div>
      </header>

      <main className="mx-auto min-h-[65vh] max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {/* HOME */}
        {page === "home" && (
          <>
            {!search && category === "All" && !location && (
              <>
                {/* Hero */}
                <section className="relative mb-8 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#17152f] via-[#25215a] to-[#3348a8] text-white shadow-xl shadow-indigo-950/10 sm:mb-10">
                  <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-32 right-1/3 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

                  <div className="relative grid items-center gap-7 px-6 py-9 sm:px-10 sm:py-12 lg:grid-cols-[1.2fr_0.8fr] lg:px-14 lg:py-14">
                    <div className="max-w-2xl">
                      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-[11px] font-semibold text-violet-100 backdrop-blur">
                        <Sparkles size={14} className="text-amber-300" />
                        YOUR NEXT GREAT FIND STARTS HERE
                      </div>

                      <h1 className="text-[34px] font-black leading-[1.12] tracking-[-1.7px] sm:text-5xl lg:text-[58px]">
                        Great finds.
                        <br />
                        <span className="bg-gradient-to-r from-violet-300 via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                          Better prices.
                        </span>
                      </h1>

                      <p className="mt-5 max-w-lg text-sm leading-7 text-indigo-100/80 sm:text-base">
                        Discover pre-loved products, connect directly with
                        sellers and find something amazing without paying full
                        price.
                      </p>

                      <div className="mt-7 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            document
                              .getElementById("products")
                              ?.scrollIntoView({ behavior: "smooth" })
                          }
                          className="flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-50"
                        >
                          Explore products
                          <ChevronRight size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() => showPage("sell")}
                          className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                        >
                          <Plus size={17} />
                          Start selling
                        </button>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs text-indigo-100/80">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={15} className="text-emerald-300" />
                          Direct connections
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={15} className="text-emerald-300" />
                          Pre-loved products
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={15} className="text-emerald-300" />
                          Simple listings
                        </span>
                      </div>
                    </div>

                    <div className="relative mx-auto hidden w-full max-w-md lg:block">
                      <div className="absolute inset-8 rounded-full bg-violet-400/20 blur-3xl" />

                      <div className="relative rounded-[26px] border border-white/15 bg-white/[0.08] p-4 shadow-2xl backdrop-blur-xl">
                        <div className="mb-4 flex items-center justify-between px-1">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200">
                              Handpicked finds
                            </p>
                            <p className="mt-1 text-sm font-bold text-white">
                              Worth a second look
                            </p>
                          </div>
                          <span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-[10px] font-bold text-emerald-200">
                            PRE-LOVED
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="overflow-hidden rounded-2xl bg-white p-2">
                            <img
                              src={DEMO_PRODUCTS[0].image}
                              alt="Pre-owned smartphone"
                              className="h-32 w-full rounded-xl object-cover"
                            />
                            <p className="mt-2 truncate text-xs font-bold text-slate-900">
                              iPhone 13
                            </p>
                            <p className="mt-1 text-sm font-extrabold text-violet-700">
                              ₹28,500
                            </p>
                          </div>

                          <div className="mt-6 overflow-hidden rounded-2xl bg-white p-2">
                            <img
                              src={DEMO_PRODUCTS[5].image}
                              alt="Pre-owned camera"
                              className="h-32 w-full rounded-xl object-cover"
                            />
                            <p className="mt-2 truncate text-xs font-bold text-slate-900">
                              DSLR Camera
                            </p>
                            <p className="mt-1 text-sm font-extrabold text-violet-700">
                              ₹22,000
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-200">
                            <BadgeCheck size={22} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">
                              Your next great deal
                            </p>
                            <p className="mt-1 text-[10px] text-indigo-100/70">
                              Search, connect and discover
                            </p>
                          </div>
                          <ArrowUpDown size={16} className="ml-auto text-indigo-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Feature strip */}
                <section className="mb-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    {
                      icon: ShieldCheck,
                      title: "Direct deals",
                      text: "Connect with sellers",
                    },
                    {
                      icon: IndianRupee,
                      title: "Better value",
                      text: "Find pre-loved goods",
                    },
                    {
                      icon: Zap,
                      title: "Easy listings",
                      text: "Post products simply",
                    },
                    {
                      icon: Headphones,
                      title: "Stay connected",
                      text: "Chat with sellers",
                    },
                  ].map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={feature.title}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                          <Icon size={19} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {feature.title}
                          </p>
                          <p className="mt-1 text-[10px] leading-4 text-slate-500">
                            {feature.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </section>

                {/* Categories */}
                <section className="mb-10">
                  <div className="mb-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
                        Explore your interests
                      </p>
                      <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                        Browse categories
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCategory("All")}
                      className="text-xs font-bold text-violet-700 hover:text-violet-900"
                    >
                      View all
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                    {CATEGORIES.map((item, index) => {
                      const Icon = item.icon;
                      const colors = [
                        "bg-slate-100 text-slate-700",
                        "bg-violet-50 text-violet-700",
                        "bg-orange-50 text-orange-600",
                        "bg-blue-50 text-blue-700",
                        "bg-amber-50 text-amber-700",
                        "bg-pink-50 text-pink-600",
                        "bg-cyan-50 text-cyan-700",
                      ];

                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => {
                            setCategory(item.name);
                            document
                              .getElementById("products")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={`group flex min-h-[105px] flex-col items-center justify-center gap-3 rounded-2xl border p-3 transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-900/[0.04] ${
                            category === item.name
                              ? "border-violet-300 bg-violet-50"
                              : "border-slate-200/80 bg-white"
                          }`}
                        >
                          <span
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:scale-105 ${colors[index]}`}
                          >
                            <Icon size={22} />
                          </span>
                          <span className="text-[11px] font-bold text-slate-700 sm:text-xs">
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </>
            )}

            {/* Product listing area */}
            <section id="products" className="scroll-mt-40">
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
                    {search ? "Search results" : "The latest finds"}
                  </p>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    {search
                      ? `Results for "${search}"`
                      : category === "All"
                        ? "Discover products"
                        : category}
                  </h2>
                  <p className="mt-2 text-xs text-slate-500">
                    {filteredProducts.length} products found
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 sm:min-w-[170px] sm:flex-none">
                    <MapPin size={16} className="shrink-0 text-violet-600" />
                    <input
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="Filter by city"
                      className="w-full min-w-0 bg-transparent text-xs outline-none placeholder:text-slate-400"
                    />
                    {location && (
                      <button
                        type="button"
                        onClick={() => setLocation("")}
                        aria-label="Clear location"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                    <SlidersHorizontal size={15} className="text-violet-600" />
                    <select
                      value={maxPrice}
                      onChange={(event) => setMaxPrice(event.target.value)}
                      aria-label="Maximum price"
                      className="max-w-[130px] bg-transparent text-xs font-semibold outline-none"
                    >
                      <option value="All">Any price</option>
                      <option value="1000">Under ₹1,000</option>
                      <option value="5000">Under ₹5,000</option>
                      <option value="10000">Under ₹10,000</option>
                      <option value="25000">Under ₹25,000</option>
                      <option value="50000">Under ₹50,000</option>
                      <option value="100000">Under ₹1 lakh</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                    <ArrowUpDown size={15} className="text-violet-600" />
                    <select
                      value={sort}
                      onChange={(event) => setSort(event.target.value)}
                      aria-label="Sort products"
                      className="bg-transparent text-xs font-semibold outline-none"
                    >
                      <option value="newest">Newest first</option>
                      <option value="low">Price: low to high</option>
                      <option value="high">Price: high to low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category chips */}
              <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
                {CATEGORIES.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setCategory(item.name)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${
                      category === item.name
                        ? "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-600/15"
                        : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Search}
                  title="No products found"
                  description="Try a different search, change the category or remove some filters."
                  buttonText="Clear all filters"
                  onClick={() => {
                    setSearch("");
                    setLocation("");
                    setCategory("All");
                    setMaxPrice("All");
                    setSort("newest");
                  }}
                />
              )}
            </section>

            {/* Sell banner */}
            <section className="mt-12 overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-blue-50 p-6 sm:p-9">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
                    <Package size={23} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                      Have something to sell?
                    </h2>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                      Give your pre-loved products a new home. Create a listing
                      with photos, a price and a description.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showPage("sell")}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700"
                >
                  <Plus size={17} />
                  Post an ad
                </button>
              </div>
            </section>
          </>
        )}

        {/* PRODUCT DETAILS */}
        {page === "details" && selectedProduct && (
          <section>
            <button
              type="button"
              onClick={() => showPage("home")}
              className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-violet-700"
            >
              <ArrowLeft size={17} />
              Back to products
            </button>

            <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
              <div>
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                  <div className="aspect-[4/3] bg-slate-100">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Product description
                  </h2>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {selectedProduct.description}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Category
                      </p>
                      <p className="mt-2 text-sm font-bold text-slate-800">
                        {selectedProduct.category}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Listed
                      </p>
                      <p className="mt-2 text-sm font-bold text-slate-800">
                        {formatTime(selectedProduct.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-5">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                    <BadgeCheck size={13} />
                    Pre-loved product
                  </span>

                  <h1 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-3xl">
                    {selectedProduct.title}
                  </h1>

                  <p className="mt-4 text-3xl font-black tracking-tight text-slate-950">
                    {money(selectedProduct.price)}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 border-b border-slate-100 pb-5 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={15} className="text-violet-600" />
                      {selectedProduct.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock3 size={15} />
                      {formatTime(selectedProduct.createdAt)}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700">
                      <CircleUserRound size={25} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {selectedProduct.seller}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Listed on SELDOL
                      </p>
                    </div>
                    <BadgeCheck size={20} className="text-violet-600" />
                  </div>

                  <div className="mt-6 space-y-3">
                    {selectedProduct.seller !== profileName && (
                      <button
                        type="button"
                        onClick={() => startChat(selectedProduct)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/15 transition hover:bg-violet-700"
                      >
                        <MessageCircle size={18} />
                        Chat with seller
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => startWhatsApp(selectedProduct)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      <MessageSquare size={18} />
                      Contact on WhatsApp
                    </button>

                    <button
                      type="button"
                      onClick={() => startCall(selectedProduct)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Phone size={17} />
                      Call seller
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(selectedProduct.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Heart
                        size={17}
                        fill={
                          favorites.includes(selectedProduct.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                      {favorites.includes(selectedProduct.id)
                        ? "Saved to wishlist"
                        : "Add to wishlist"}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <ShieldCheck size={20} className="shrink-0 text-amber-700" />
                    <div>
                      <h3 className="text-xs font-bold text-amber-900">
                        Stay safe while buying
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-amber-800">
                        Inspect the product in person, verify ownership and
                        avoid sending advance payments to unknown sellers.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        )}

        {/* SELL PRODUCT */}
        {page === "sell" && (
          <section className="mx-auto max-w-4xl">
            <button
              type="button"
              onClick={() => showPage("home")}
              className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-violet-700"
            >
              <ArrowLeft size={17} />
              Back to home
            </button>

            <PageHeading
              eyebrow="Start selling"
              title="Create your listing"
              subtitle="Add accurate details so buyers can understand your product and contact you."
            />

            <form onSubmit={handleSell} className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Product photos
                </h2>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Upload one clear image. JPG, PNG and WebP are supported. Maximum
                  size: 2 MB.
                </p>

                <label className="mt-5 flex min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-violet-400 hover:bg-violet-50/40">
                  {newImage ? (
                    <div className="relative w-full">
                      <img
                        src={newImage}
                        alt="Product preview"
                        className="mx-auto max-h-[300px] w-full object-contain"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-slate-950/75 px-4 py-3 text-xs font-semibold text-white">
                        <ImagePlus size={15} />
                        Change image
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                        <Upload size={24} />
                      </span>
                      <span className="mt-4 text-sm font-bold text-slate-800">
                        Upload product image
                      </span>
                      <span className="mt-2 text-xs text-slate-500">
                        Tap here to choose a photo
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </label>

                {imageName && (
                  <p className="mt-3 truncate text-xs text-slate-500">
                    Selected: {imageName}
                  </p>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Product information
                </h2>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="product-title"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Product title *
                    </label>
                    <input
                      id="product-title"
                      value={newTitle}
                      onChange={(event) => setNewTitle(event.target.value)}
                      placeholder="e.g. iPhone 13 128GB, excellent condition"
                      maxLength={100}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="product-price"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Expected price (₹) *
                    </label>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">
                      <IndianRupee size={17} className="text-slate-400" />
                      <input
                        id="product-price"
                        type="number"
                        min="1"
                        max="100000000"
                        step="1"
                        value={newPrice}
                        onChange={(event) => setNewPrice(event.target.value)}
                        placeholder="Enter amount"
                        required
                        className="w-full bg-transparent px-2 py-3.5 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="product-category"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Category *
                    </label>
                    <select
                      id="product-category"
                      value={newCategory}
                      onChange={(event) => setNewCategory(event.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                    >
                      {CATEGORIES.filter((item) => item.name !== "All").map(
                        (item) => (
                          <option key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="product-location"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      City or area *
                    </label>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-100">
                      <MapPin size={17} className="text-slate-400" />
                      <input
                        id="product-location"
                        value={newLocation}
                        onChange={(event) => setNewLocation(event.target.value)}
                        placeholder="e.g. Rohini, Delhi"
                        maxLength={100}
                        required
                        className="w-full bg-transparent px-2 py-3.5 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="product-description"
                      className="mb-2 block text-xs font-bold text-slate-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="product-description"
                      value={newDescription}
                      onChange={(event) =>
                        setNewDescription(event.target.value)
                      }
                      placeholder="Describe condition, age, features and anything a buyer should know..."
                      rows={5}
                      maxLength={2000}
                      className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-6 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                    <p className="mt-2 text-right text-[10px] text-slate-400">
                      {newDescription.length}/2000
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Contact details
                </h2>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  A phone number is optional. Add it if you want to offer direct
                  calling and WhatsApp contact in this frontend demo.
                </p>

                <div className="mt-5">
                  <label
                    htmlFor="product-phone"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Phone number
                  </label>
                  <input
                    id="product-phone"
                    type="tel"
                    inputMode="tel"
                    value={newPhone}
                    onChange={(event) => setNewPhone(event.target.value)}
                    placeholder="Enter your contact number"
                    maxLength={20}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => showPage("home")}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <Plus size={17} />
                  Publish listing
                </button>
              </div>
            </form>
          </section>
        )}

        {/* MY ADS */}
        {page === "myads" && (
          <section>
            <PageHeading
              eyebrow="Seller dashboard"
              title="My listings"
              subtitle="Manage the products you've posted on this device."
            />

            <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-500">
                    Total listings
                  </p>
                  <Package size={18} className="text-violet-600" />
                </div>
                <p className="mt-3 text-3xl font-black text-slate-900">
                  {ownProducts.length}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-500">
                    Asking value
                  </p>
                  <IndianRupee size={18} className="text-emerald-600" />
                </div>
                <p className="mt-3 text-2xl font-black text-slate-900">
                  {money(
                    ownProducts.reduce((total, product) => total + product.price, 0),
                  )}
                </p>
              </div>
              <div className="col-span-2 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-blue-50 p-5 sm:col-span-1">
                <p className="text-xs font-semibold text-slate-500">
                  Want to sell more?
                </p>
                <button
                  type="button"
                  onClick={() => showPage("sell")}
                  className="mt-3 flex items-center gap-2 text-sm font-bold text-violet-700"
                >
                  <Plus size={17} />
                  Create listing
                </button>
              </div>
            </div>

            {ownProducts.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No listings yet"
                description="Your products will appear here after you publish your first listing."
                buttonText="Sell your first product"
                onClick={() => showPage("sell")}
              />
            ) : (
              <div className="space-y-3">
                {ownProducts.map((product) => (
                  <article
                    key={product.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
                  >
                    <button
                      type="button"
                      onClick={() => openProduct(product)}
                      className="flex min-w-0 flex-1 items-center gap-4 text-left"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-24 w-24 shrink-0 rounded-xl bg-slate-100 object-cover"
                      />
                      <div className="min-w-0">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                          Published on this device
                        </span>
                        <h3 className="mt-2 truncate text-sm font-bold text-slate-900">
                          {product.title}
                        </h3>
                        <p className="mt-1 text-lg font-extrabold text-slate-900">
                          {money(product.price)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {product.location} · {formatTime(product.createdAt)}
                        </p>
                      </div>
                    </button>

                    <div className="flex gap-2 sm:flex-col">
                      <button
                        type="button"
                        onClick={() => openProduct(product)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(product.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-100 px-3 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* WISHLIST */}
        {page === "wishlist" && (
          <section>
            <PageHeading
              eyebrow="Your saved finds"
              title="Wishlist"
              subtitle="Keep the products you love in one place."
            />

            {products.filter((product) => favorites.includes(product.id))
              .length === 0 ? (
              <EmptyState
                icon={Heart}
                title="Your wishlist is empty"
                description="Tap the heart on any product to save it here for later."
                buttonText="Explore products"
                onClick={() => showPage("home")}
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {products
                  .filter((product) => favorites.includes(product.id))
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            )}
          </section>
        )}

        {/* MESSAGES */}
        {page === "messages" && (
          <section>
            <PageHeading
              eyebrow="Conversations"
              title="Messages"
              subtitle="Open a product conversation and try the chat interface."
            />

            <div className="grid min-h-[480px] overflow-hidden rounded-3xl border border-slate-200 bg-white md:grid-cols-[300px_1fr]">
              <aside className="border-b border-slate-200 md:border-b-0 md:border-r">
                <div className="border-b border-slate-100 p-5">
                  <h2 className="font-extrabold text-slate-900">
                    Your conversations
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Demo conversations saved on this device
                  </p>
                </div>

                <div className="max-h-[450px] overflow-y-auto">
                  {products
                    .filter(
                      (product) =>
                        product.seller !== profileName ||
                        chatMessages.some(
                          (message) => message.productId === product.id,
                        ),
                    )
                    .map((product) => {
                      const latest = [...chatMessages]
                        .reverse()
                        .find((message) => message.productId === product.id);

                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => setChatProduct(product)}
                          className={`flex w-full items-center gap-3 border-b border-slate-100 p-4 text-left transition ${
                            chatProduct?.id === product.id
                              ? "bg-violet-50"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <img
                            src={product.image}
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-xl bg-slate-100 object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-slate-900">
                              {product.seller}
                            </p>
                            <p className="mt-1 truncate text-[11px] text-slate-500">
                              {latest?.text || product.title}
                            </p>
                          </div>
                          {latest && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                          )}
                        </button>
                      );
                    })}
                </div>
              </aside>

              <div className="flex min-h-[440px] flex-col">
                {chatProduct ? (
                  <>
                    <div className="flex items-center gap-3 border-b border-slate-100 p-4 sm:p-5">
                      <button
                        type="button"
                        onClick={() => setChatProduct(null)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
                        aria-label="Back to conversations"
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <img
                        src={chatProduct.image}
                        alt=""
                        className="h-11 w-11 rounded-xl bg-slate-100 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {chatProduct.seller}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {chatProduct.title} · {money(chatProduct.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4 bg-slate-50/60 p-4 sm:p-6">
                      <div className="mx-auto max-w-sm rounded-2xl border border-amber-100 bg-amber-50 p-4 text-center">
                        <MessageCircle
                          size={22}
                          className="mx-auto text-amber-700"
                        />
                        <p className="mt-2 text-xs font-bold text-amber-900">
                          Frontend chat demo
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-amber-800">
                          Messages are saved only on this device. They are not
                          delivered to the seller.
                        </p>
                      </div>

                      {chatMessages
                        .filter(
                          (message) =>
                            message.productId === chatProduct.id,
                        )
                        .map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.sender === profileName
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                message.sender === profileName
                                  ? "rounded-br-sm bg-violet-600 text-white"
                                  : "rounded-bl-sm border border-slate-200 bg-white text-slate-800"
                              }`}
                            >
                              <p className="break-words text-sm leading-6">
                                {message.text}
                              </p>
                              <p
                                className={`mt-1 text-[10px] ${
                                  message.sender === profileName
                                    ? "text-violet-200"
                                    : "text-slate-400"
                                }`}
                              >
                                {new Date(message.time).toLocaleTimeString(
                                  "en-IN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>

                    <form
                      onSubmit={sendChat}
                      className="flex gap-2 border-t border-slate-100 p-4"
                    >
                      <input
                        value={chatText}
                        onChange={(event) => setChatText(event.target.value)}
                        placeholder="Type a demo message..."
                        maxLength={1000}
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:bg-white"
                      />
                      <button
                        type="submit"
                        disabled={!chatText.trim()}
                        className="flex h-11 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Send message"
                      >
                        <Send size={17} />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                      <MessageCircle size={29} />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      Your conversations
                    </h3>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Select a product conversation to open the demo chat.
                      Real-time messaging will need a backend.
                    </p>
                    <button
                      type="button"
                      onClick={() => showPage("home")}
                      className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white hover:bg-violet-700"
                    >
                      Browse products
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* PROFILE */}
        {page === "profile" && (
          <section className="mx-auto max-w-4xl">
            <PageHeading
              eyebrow="Your account"
              title="My profile"
              subtitle="Manage your local demo profile and contact details."
            />

            <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#211b4e] via-violet-800 to-blue-700 p-6 text-white sm:p-9">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/10 text-white backdrop-blur">
                  <CircleUserRound size={43} />
                </div>
                <div>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-100">
                    Local demo profile
                  </span>
                  <h2 className="mt-3 text-2xl font-extrabold">
                    {profileName}
                  </h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-indigo-100/80">
                    <MapPin size={15} />
                    {profileCity}
                  </p>
                </div>
                <div className="sm:ml-auto">
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-center">
                    <p className="text-2xl font-black">{ownProducts.length}</p>
                    <p className="mt-1 text-[10px] font-semibold text-indigo-100">
                      Your listings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form
              onSubmit={saveProfile}
              className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <Settings size={21} />
                </div>
                <div>
                  <h2 className="font-extrabold text-slate-900">
                    Personal information
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Your information is stored locally in this browser.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="profile-name"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Display name
                  </label>
                  <input
                    id="profile-name"
                    value={profileName}
                    onChange={(event) => {
                      setProfileName(event.target.value);
                      setProfileSaved(false);
                    }}
                    maxLength={80}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-city"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    City
                  </label>
                  <input
                    id="profile-city"
                    value={profileCity}
                    onChange={(event) => {
                      setProfileCity(event.target.value);
                      setProfileSaved(false);
                    }}
                    maxLength={100}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="profile-phone"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Contact number
                  </label>
                  <input
                    id="profile-phone"
                    type="tel"
                    inputMode="tel"
                    value={profilePhone}
                    onChange={(event) => {
                      setProfilePhone(event.target.value);
                      setProfileSaved(false);
                    }}
                    maxLength={20}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/15 transition hover:bg-violet-700"
                >
                  <CheckCircle2 size={17} />
                  Save profile
                </button>
                {profileSaved && (
                  <span className="text-xs font-semibold text-emerald-700">
                    Profile saved on this device.
                  </span>
                )}
              </div>
            </form>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex gap-3">
                <ShieldCheck size={21} className="shrink-0 text-amber-700" />
                <div>
                  <h3 className="text-sm font-bold text-amber-900">
                    Demo version: no account login yet
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-amber-800">
                    This profile is saved only in your current browser. It is
                    not an authenticated account and will not sync across
                    different devices. Account registration and secure cloud
                    storage can be added in the backend phase.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-10 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <button
                type="button"
                onClick={() => showPage("home")}
                className="flex items-center gap-2"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white">
                  <ShoppingBag size={19} />
                </span>
                <span className="text-xl font-black tracking-tight text-slate-950">
                  SEL<span className="text-violet-600">DOL</span>
                </span>
              </button>
              <p className="mt-4 max-w-xs text-xs leading-6 text-slate-500">
                A modern second-hand marketplace concept designed to help
                people discover products and connect with sellers across India.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Marketplace
              </h3>
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => showPage("home")}
                  className="block text-xs text-slate-500 hover:text-violet-700"
                >
                  Browse products
                </button>
                <button
                  type="button"
                  onClick={() => showPage("sell")}
                  className="block text-xs text-slate-500 hover:text-violet-700"
                >
                  Sell an item
                </button>
                <button
                  type="button"
                  onClick={() => showPage("wishlist")}
                  className="block text-xs text-slate-500 hover:text-violet-700"
                >
                  My wishlist
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Your account
              </h3>
              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => showPage("myads")}
                  className="block text-xs text-slate-500 hover:text-violet-700"
                >
                  My listings
                </button>
                <button
                  type="button"
                  onClick={() => showPage("messages")}
                  className="block text-xs text-slate-500 hover:text-violet-700"
                >
                  Messages
                </button>
                <button
                  type="button"
                  onClick={() => showPage("profile")}
                  className="block text-xs text-slate-500 hover:text-violet-700"
                >
                  My profile
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Smart shopping
              </h3>
              <div className="mt-4 space-y-3 text-xs leading-5 text-slate-500">
                <p className="flex items-start gap-2">
                  <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-600" />
                  Meet sellers safely and inspect items before paying.
                </p>
                <p className="flex items-start gap-2">
                  <Heart size={15} className="mt-0.5 shrink-0 text-violet-600" />
                  Save interesting finds to your wishlist.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-3 border-t border-slate-100 pt-5 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} SELDOL. All rights reserved.</p>
            <p>Buy smart. Sell easy. Give products a second life.</p>
          </div>
        </div>
      </footer>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl sm:hidden">
        {[
          { name: "Home", target: "home" as PageName, icon: LayoutGrid },
          { name: "Wishlist", target: "wishlist" as PageName, icon: Heart },
          { name: "Sell", target: "sell" as PageName, icon: Plus },
          { name: "Messages", target: "messages" as PageName, icon: MessageCircle },
          { name: "Profile", target: "profile" as PageName, icon: UserRound },
        ].map((item) => {
          const Icon = item.icon;
          const active = page === item.target;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => showPage(item.target)}
              className={`flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-bold transition ${
                active ? "text-violet-700" : "text-slate-400"
              }`}
            >
              <span
                className={`flex h-8 w-9 items-center justify-center rounded-xl ${
                  item.target === "sell"
                    ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-md shadow-violet-600/20"
                    : active
                      ? "bg-violet-50"
                      : ""
                }`}
              >
                <Icon size={19} />
              </span>
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Toast notification */}
      {notice && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-50 flex max-w-[90vw] -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl sm:bottom-6"
        >
          <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Mobile bottom-nav spacing */}
      <div className="h-20 sm:hidden" />
    </div>
  );
}
