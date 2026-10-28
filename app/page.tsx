"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Heart,
  Plus,
  MessageCircle,
  X,
  SlidersHorizontal,
  Camera,
  Phone,
  Menu,
  Package,
  ChevronDown,
} from "lucide-react";

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

const initialProducts: Product[] = [
  {
    id: "1",
    title: "iPhone 13 • 128 GB",
    price: 28500,
    category: "Mobiles",
    location: "Delhi",
    description: "Good condition iPhone 13. All features working.",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700",
    seller: "Rahul",
    phone: "",
    createdAt: 1,
  },
  {
    id: "2",
    title: "Royal Enfield Classic 350",
    price: 115000,
    category: "Motorcycles",
    location: "Gurugram",
    description: "Well-maintained motorcycle. Contact for details.",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=700",
    seller: "Amit",
    phone: "",
    createdAt: 2,
  },
  {
    id: "3",
    title: "Study Table with Chair",
    price: 3500,
    category: "Furniture",
    location: "Noida",
    description: "Study table and chair in good condition.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=700",
    seller: "Priya",
    phone: "",
    createdAt: 3,
  },
  {
    id: "4",
    title: "HP Laptop Core i5",
    price: 22000,
    category: "Electronics",
    location: "Delhi",
    description: "HP laptop suitable for study and office work.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700",
    seller: "Vikas",
    phone: "",
    createdAt: 4,
  },
  {
    id: "5",
    title: "Men's Casual Sneakers",
    price: 900,
    category: "Fashion",
    location: "Faridabad",
    description: "Casual sneakers in good condition.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
    seller: "Arjun",
    phone: "",
    createdAt: 5,
  },
  {
    id: "6",
    title: "Canon DSLR Camera",
    price: 18500,
    category: "Electronics",
    location: "Delhi",
    description: "DSLR camera for photography enthusiasts.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700",
    seller: "Neha",
    phone: "",
    createdAt: 6,
  },
  {
    id: "7",
    title: "Mountain Bicycle",
    price: 6500,
    category: "Accessories",
    location: "Ghaziabad",
    description: "Mountain bicycle in good working condition.",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=700",
    seller: "Rohit",
    phone: "",
    createdAt: 7,
  },
  {
    id: "8",
    title: "Wooden Bookshelf",
    price: 2400,
    category: "Furniture",
    location: "Noida",
    description: "Wooden bookshelf with multiple shelves.",
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=700",
    seller: "Simran",
    phone: "",
    createdAt: 8,
  },
];

const categories = [
  "All",
  "Mobiles",
  "Motorcycles",
  "Electronics",
  "Furniture",
  "Fashion",
  "Accessories",
];

const formatPrice = (price: number) =>
  "₹" + price.toLocaleString("en-IN");

export default function Home() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showSell, setShowSell] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [sellForm, setSellForm] = useState({
    title: "",
    price: "",
    category: "Mobiles",
    location: "",
    description: "",
    seller: "",
    phone: "",
  });

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("seldol_products");
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts) as Product[];
        if (Array.isArray(parsed)) {
          const savedIds = new Set(parsed.map((p) => p.id));
          setProducts([
            ...parsed,
            ...initialProducts.filter((p) => !savedIds.has(p.id)),
          ]);
        }
      }

      const savedFavorites = localStorage.getItem("seldol_favorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch {
      // Continue with demo products if browser storage is unavailable.
    }
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const searchText =
        `${product.title} ${product.description} ${product.category} ${product.location}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase().trim());
      const matchesLocation = product.location
        .toLowerCase()
        .includes(location.toLowerCase().trim());
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesPrice =
        maxPrice === "" || product.price <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesLocation &&
        matchesCategory &&
        matchesPrice
      );
    });

    if (sort === "low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "newest")
      result = [...result].sort((a, b) => b.createdAt - a.createdAt);

    return result;
  }, [products, search, location, category, maxPrice, sort]);

  function toggleFavorite(id: string) {
    const updated = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];

    setFavorites(updated);
    localStorage.setItem("seldol_favorites", JSON.stringify(updated));
  }

  function handleImageUpload(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setNotice("Image must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
        setNotice("");
      }
    };

    reader.readAsDataURL(file);
  }

  function publishProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const price = Number(sellForm.price);

    if (!sellForm.title.trim() || !Number.isFinite(price) || price <= 0) {
      setNotice("Enter a product name and a valid price.");
      return;
    }

    if (!sellForm.location.trim() || !sellForm.seller.trim()) {
      setNotice("Enter your city and seller name.");
      return;
    }

    if (!sellForm.phone.trim()) {
      setNotice("Enter a contact phone number.");
      return;
    }

    const newProduct: Product = {
      id: `user-${Date.now()}`,
      title: sellForm.title.trim(),
      price,
      category: sellForm.category,
      location: sellForm.location.trim(),
      description: sellForm.description.trim(),
      image: imagePreview,
      seller: sellForm.seller.trim(),
      phone: sellForm.phone.trim(),
      createdAt: Date.now(),
    };

    const updated = [newProduct, ...products];
    setProducts(updated);

    try {
      localStorage.setItem("seldol_products", JSON.stringify(updated));
    } catch {
      setNotice("Browser storage is full. Try a smaller image.");
      return;
    }

    setCategory("All");
    setSearch("");
    setLocation("");
    setMaxPrice("");
    setSort("newest");
    setShowSell(false);
    setImagePreview("");
    setSellForm({
      title: "",
      price: "",
      category: "Mobiles",
      location: "",
      description: "",
      seller: "",
      phone: "",
    });

    setNotice("Your product has been published on this device.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function contactSeller(product: Product) {
    if (!product.phone) {
      setNotice(
        `${product.seller} has not added a contact number in this demo.`,
      );
      return;
    }

    const phone = product.phone.replace(/[^\d+]/g, "");
    const message = encodeURIComponent(
      `Hi ${product.seller}, I am interested in your ${product.title} listed on SELDOL for ${formatPrice(product.price)}.`,
    );

    window.open(
      `https://wa.me/${phone.replace(/^\+/, "")}?text=${message}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  function resetFilters() {
    setSearch("");
    setLocation("");
    setCategory("All");
    setMaxPrice("");
    setSort("newest");
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#252b35]">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-6">
          <a href="./" className="shrink-0 text-2xl font-black tracking-tight text-[#1767d2]">
            SEL<span className="text-[#f39b27]">DOL</span>
          </a>

          <div className="hidden flex-1 items-center gap-2 rounded-xl border border-gray-300 px-3 py-2 md:flex">
            <Search size={20} className="text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mobiles, bikes, furniture..."
              className="w-full bg-transparent outline-none"
            />
          </div>

          <button
            onClick={() => setShowSell(true)}
            className="ml-auto flex items-center gap-2 rounded-xl bg-[#1767d2] px-4 py-3 font-bold text-white hover:bg-blue-700"
          >
            <Plus size={19} />
            <span>Sell Product</span>
          </button>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg p-2 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 pb-3 md:hidden">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2">
            <Search size={18} className="shrink-0 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full min-w-0 bg-transparent outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-xl border border-gray-300 p-3"
            aria-label="Open filters"
          >
            <SlidersHorizontal size={19} />
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t bg-white px-4 py-3 md:hidden">
            <p className="mb-2 font-semibold">Browse categories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setCategory(item);
                    setMobileMenu(false);
                  }}
                  className={`rounded-full border px-3 py-2 text-sm ${
                    category === item
                      ? "border-[#1767d2] bg-blue-50 text-[#1767d2]"
                      : "border-gray-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <section className="mx-auto max-w-7xl px-4 pt-7 md:px-6 md:pt-10">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#123d7a] to-[#1767d2] px-6 py-9 text-white md:px-12 md:py-14">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
            India&apos;s second-hand marketplace
          </p>
          <h1 className="max-w-2xl text-3xl font-black leading-tight md:text-5xl">
            Buy smart.
            <br />
            Sell easy.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-blue-100 md:text-base">
            Discover great deals on pre-owned products near you. Give your
            unused things a new home.
          </p>
          <button
            onClick={() => setShowSell(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#f39b27] px-5 py-3 font-bold text-white hover:bg-orange-600"
          >
            <Plus size={19} /> Start selling
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8 md:px-6">
        <h2 className="mb-4 text-xl font-extrabold">Browse categories</h2>
        <div className="flex gap-3 overflow-x-auto pb-3">
          {categories.map((item, index) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-2xl border px-5 py-4 text-left transition ${
                category === item
                  ? "border-[#1767d2] bg-blue-50 text-[#1767d2]"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              <span className="block text-lg font-bold">
                {["All", "Mobiles", "Bikes", "Electronics", "Furniture", "Fashion", "More"][index]}
              </span>
              <span className="mt-1 block text-xs text-gray-500">{item}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 pt-7 md:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold md:text-2xl">
              Products near you
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredProducts.length} products found
            </p>
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm">
            <span className="text-gray-500">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="max-w-32 bg-transparent font-semibold outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-[240px_1fr]">
          <aside
            className={`h-fit rounded-2xl border border-gray-200 bg-white p-5 ${
              showFilters ? "block" : "hidden md:block"
            }`}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-extrabold">
                <SlidersHorizontal size={18} /> Filters
              </h3>
              <button
                onClick={resetFilters}
                className="text-sm font-semibold text-[#1767d2]"
              >
                Clear all
              </button>
            </div>

            <label className="mb-2 block text-sm font-bold">Category</label>
            <div className="mb-5 space-y-3">
              {categories.map((item) => (
                <label
                  key={item}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={category === item}
                    onChange={() => setCategory(item)}
                    className="accent-[#1767d2]"
                  />
                  {item}
                </label>
              ))}
            </div>

            <label htmlFor="filter-location" className="mb-2 block text-sm font-bold">
              City or location
            </label>
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-gray-300 px-3 py-2">
              <MapPin size={17} className="shrink-0 text-gray-500" />
              <input
                id="filter-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Delhi"
                className="w-full min-w-0 text-sm outline-none"
              />
            </div>

            <label htmlFor="filter-price" className="mb-2 block text-sm font-bold">
              Maximum price (₹)
            </label>
            <input
              id="filter-price"
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="e.g. 10000"
              className="mb-4 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#1767d2]"
            />

            <button
              onClick={() => setShowFilters(false)}
              className="w-full rounded-xl bg-[#1767d2] py-3 font-bold text-white md:hidden"
            >
              Show {filteredProducts.length} results
            </button>
          </aside>

          <div>
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
                <Package size={42} className="mx-auto mb-3 text-gray-400" />
                <h3 className="text-lg font-bold">No products found</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Try a different search or clear your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 rounded-xl bg-[#1767d2] px-5 py-3 font-bold text-white"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] bg-gray-100">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          <Camera size={36} />
                        </div>
                      )}

                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute right-2 top-2 rounded-full bg-white/95 p-2 shadow"
                        aria-label="Add to favorites"
                      >
                        <Heart
                          size={18}
                          className={
                            favorites.includes(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-600"
                          }
                        />
                      </button>
                    </div>

                    <div className="p-3 sm:p-4">
                      <p className="mb-1 text-xs font-semibold text-[#1767d2]">
                        {product.category}
                      </p>
                      <h3 className="line-clamp-2 min-h-10 text-sm font-bold sm:text-base">
                        {product.title}
                      </h3>
                      <p className="mt-2 text-lg font-black sm:text-xl">
                        {formatPrice(product.price)}
                      </p>
                      <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={13} className="shrink-0" />
                        <span className="truncate">{product.location}</span>
                      </p>
                      <p className="mt-1 truncate text-xs text-gray-500">
                        Seller: {product.seller}
                      </p>
                      <button
                        onClick={() => contactSeller(product)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1767d2] px-2 py-3 text-sm font-bold text-white hover:bg-blue-700"
                      >
                        <MessageCircle size={17} /> Contact Seller
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white px-4 py-8 text-center">
        <a href="./" className="text-xl font-black text-[#1767d2]">
          SEL<span className="text-[#f39b27]">DOL</span>
        </a>
        <p className="mt-2 text-sm text-gray-500">
          Buy smart. Sell easy. A marketplace for pre-owned products.
        </p>
        <p className="mt-3 text-xs text-gray-400">
          © {new Date().getFullYear()} SELDOL
        </p>
      </footer>

      {notice && (
        <div className="fixed bottom-4 left-4 right-4 z-[70] mx-auto flex max-w-lg items-center justify-between gap-3 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-xl">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Close notice">
            <X size={18} />
          </button>
        </div>
      )}

      {showSell && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Sell your product</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Add details to create your listing.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSell(false);
                  setNotice("");
                }}
                className="rounded-full bg-gray-100 p-2"
                aria-label="Close sell form"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={publishProduct} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold">Product name *</span>
                <input
                  required
                  maxLength={80}
                  value={sellForm.title}
                  onChange={(e) =>
                    setSellForm({ ...sellForm, title: e.target.value })
                  }
                  placeholder="e.g. Samsung Galaxy S23"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1767d2]"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className="mb-2 block text-sm font-bold">Price (₹) *</span>
                  <input
                    required
                    type="number"
                    min="1"
                    max="100000000"
                    value={sellForm.price}
                    onChange={(e) =>
                      setSellForm({ ...sellForm, price: e.target.value })
                    }
                    placeholder="5000"
                    className="w-full min-w-0 rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-[#1767d2]"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold">Category *</span>
                  <select
                    value={sellForm.category}
                    onChange={(e) =>
                      setSellForm({ ...sellForm, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-2 py-3 outline-none focus:border-[#1767d2]"
                  >
                    {categories
                      .filter((item) => item !== "All")
                      .map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-bold">City / location *</span>
                <input
                  required
                  maxLength={100}
                  value={sellForm.location}
                  onChange={(e) =>
                    setSellForm({ ...sellForm, location: e.target.value })
                  }
                  placeholder="e.g. Delhi"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1767d2]"
                />
              </label>

              <div>
                <span className="mb-2 block text-sm font-bold">Product photo</span>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-5 text-center hover:border-[#1767d2]">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="mb-3 max-h-44 rounded-xl object-contain"
                    />
                  ) : (
                    <Camera size={30} className="mb-2 text-gray-400" />
                  )}
                  <span className="text-sm font-semibold">
                    {imagePreview ? "Change photo" : "Choose a photo"}
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    JPG, PNG or WEBP · maximum 2 MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handleImageUpload(e.target.files?.[0])}
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-bold">Description</span>
                <textarea
                  maxLength={1000}
                  rows={3}
                  value={sellForm.description}
                  onChange={(e) =>
                    setSellForm({ ...sellForm, description: e.target.value })
                  }
                  placeholder="Describe condition, age, and other details..."
                  className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#1767d2]"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className="mb-2 block text-sm font-bold">Your name *</span>
                  <input
                    required
                    maxLength={80}
                    value={sellForm.seller}
                    onChange={(e) =>
                      setSellForm({ ...sellForm, seller: e.target.value })
                    }
                    placeholder="Your name"
                    className="w-full min-w-0 rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-[#1767d2]"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm font-bold">Phone *</span>
                  <input
                    required
                    type="tel"
                    maxLength={20}
                    value={sellForm.phone}
                    onChange={(e) =>
                      setSellForm({ ...sellForm, phone: e.target.value })
                    }
                    placeholder="WhatsApp number"
                    className="w-full min-w-0 rounded-xl border border-gray-300 px-3 py-3 outline-none focus:border-[#1767d2]"
                  />
                </label>
              </div>

              <p className="text-xs leading-5 text-gray-500">
                Demo version: listing details are saved in this browser only.
                Your phone number is used for the contact action.
              </p>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1767d2] py-4 font-extrabold text-white hover:bg-blue-700"
              >
                <Plus size={20} /> Publish Product
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
