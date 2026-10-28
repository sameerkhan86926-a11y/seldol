"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Heart,
  MessageCircle,
  Plus,
  Smartphone,
  Car,
  Bike,
  Sofa,
  Shirt,
  Laptop,
  BookOpen,
  Watch,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";

const categories = [
  { name: "Mobiles", icon: Smartphone },
  { name: "Cars", icon: Car },
  { name: "Motorcycles", icon: Bike },
  { name: "Furniture", icon: Sofa },
  { name: "Fashion", icon: Shirt },
  { name: "Electronics", icon: Laptop },
  { name: "Books", icon: BookOpen },
  { name: "Accessories", icon: Watch },
];

const products = [
  {
    id: 1,
    title: "iPhone 13 • 128 GB",
    price: 28500,
    category: "Mobiles",
    location: "Delhi",
    condition: "Good",
    color: "#e9e5df",
    emoji: "📱",
    date: "Today",
  },
  {
    id: 2,
    title: "Royal Enfield Classic 350",
    price: 115000,
    category: "Motorcycles",
    location: "Gurugram",
    condition: "Good",
    color: "#e5e8e0",
    emoji: "🏍️",
    date: "Today",
  },
  {
    id: 3,
    title: "Study Table with Chair",
    price: 3500,
    category: "Furniture",
    location: "Noida",
    condition: "Like New",
    color: "#eee5d9",
    emoji: "🪑",
    date: "Yesterday",
  },
  {
    id: 4,
    title: "HP Laptop Core i5",
    price: 22000,
    category: "Electronics",
    location: "Delhi",
    condition: "Good",
    color: "#e1e6ec",
    emoji: "💻",
    date: "Today",
  },
  {
    id: 5,
    title: "Men's Casual Sneakers",
    price: 900,
    category: "Fashion",
    location: "Faridabad",
    condition: "Like New",
    color: "#eee4e4",
    emoji: "👟",
    date: "Yesterday",
  },
  {
    id: 6,
    title: "Canon DSLR Camera",
    price: 18500,
    category: "Electronics",
    location: "Delhi",
    condition: "Good",
    color: "#e4e4e4",
    emoji: "📷",
    date: "Today",
  },
  {
    id: 7,
    title: "Mountain Bicycle",
    price: 6500,
    category: "Accessories",
    location: "Ghaziabad",
    condition: "Fair",
    color: "#e0e9e1",
    emoji: "🚲",
    date: "2 days ago",
  },
  {
    id: 8,
    title: "Wooden Bookshelf",
    price: 2400,
    category: "Furniture",
    location: "Noida",
    condition: "Good",
    color: "#eee7dc",
    emoji: "📚",
    date: "Today",
  },
];

const money = (price: number) =>
  "₹" + price.toLocaleString("en-IN");

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);

  const filtered = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase()) ||
      product.location.toLowerCase().includes(search.toLowerCase());

    return (
      matchesSearch &&
      (category === "All" || product.category === category)
    );
  });

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#252b35]">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:gap-5 lg:px-8">
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X size={23} /> : <Menu size={23} />}
          </button>

          <a
            href="/"
            className="shrink-0 text-2xl font-black tracking-tight text-[#1767d2] sm:text-3xl"
          >
            SEL<span className="text-[#f39b27]">DOL</span>
            <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[2px] text-gray-500">
              Buy smart. Sell easy.
            </span>
          </a>

          <button className="hidden min-w-[125px] items-center gap-2 rounded-lg border-2 border-gray-300 px-3 py-3 text-sm md:flex">
            <MapPin size={19} />
            <span>India</span>
            <ChevronDown size={17} className="ml-auto" />
          </button>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex min-w-0 flex-1 overflow-hidden rounded-lg border-2 border-[#252b35] focus-within:border-[#1767d2]"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="min-w-0 flex-1 px-3 py-3 text-sm outline-none sm:px-4"
              aria-label="Search products"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex items-center justify-center bg-[#252b35] px-3 text-white hover:bg-[#1767d2] sm:px-5"
            >
              <Search size={21} />
            </button>
          </form>

          <button className="hidden whitespace-nowrap rounded-lg px-3 py-2 font-bold hover:bg-gray-100 sm:block">
            Login
          </button>

          <button className="flex shrink-0 items-center gap-1 rounded-full border-[3px] border-[#1767d2] bg-white px-3 py-2 text-sm font-bold shadow-sm hover:bg-blue-50 sm:px-5">
            <Plus size={19} />
            <span>SELL</span>
          </button>
        </div>

        {mobileMenu && (
          <nav className="border-t bg-white px-5 py-4 md:hidden">
            <p className="mb-3 font-bold">Explore SELDOL</p>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setCategory(item.name);
                    setMobileMenu(false);
                  }}
                  className="rounded-lg bg-gray-50 p-3 text-left text-sm"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>

      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-4 py-3 text-sm lg:px-8">
          <button
            onClick={() => setCategory("All")}
            className="shrink-0 font-bold"
          >
            ALL CATEGORIES
          </button>

          {categories.slice(0, 6).map((item) => (
            <button
              key={item.name}
              onClick={() =>
                setCategory(
                  category === item.name ? "All" : item.name
                )
              }
              className={`shrink-0 transition hover:text-[#1767d2] ${
                category === item.name
                  ? "font-bold text-[#1767d2]"
                  : "text-gray-600"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-4 pt-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#e8f1ff] px-6 py-8 sm:px-10 sm:py-10">
          <div className="relative z-10 max-w-xl">
            <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1767d2]">
              INDIA'S BUY & SELL COMMUNITY
            </span>

            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
              Give things a{" "}
              <span className="text-[#1767d2]">second life.</span>
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-gray-600 sm:text-base">
              Find great deals on pre-loved products or sell things
              you no longer need.
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1767d2] px-5 py-3 font-bold text-white transition hover:bg-blue-800"
            >
              Explore products <ArrowRight size={18} />
            </button>
          </div>

          <div className="pointer-events-none absolute -right-8 -top-12 hidden h-80 w-80 items-center justify-center rounded-full bg-white/50 sm:flex">
            <div className="flex h-56 w-56 items-center justify-center rounded-full bg-white shadow-xl">
              <span className="text-8xl">🛍️</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Browse categories</h2>

          <button
            onClick={() => setCategory("All")}
            className="text-sm font-semibold text-[#1767d2]"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 md:grid-cols-8">
          {categories.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() =>
                setCategory(category === name ? "All" : name)
              }
              className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition hover:-translate-y-0.5 hover:border-[#1767d2] hover:bg-blue-50 ${
                category === name
                  ? "border-[#1767d2] bg-blue-50"
                  : "border-gray-100 bg-white"
              }`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf3ff] text-[#1767d2]">
                <Icon size={22} />
              </span>
              <span className="text-center text-xs font-semibold sm:text-sm">
                {name}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section
        id="products"
        className="mx-auto max-w-7xl px-4 pb-12 pt-10 lg:px-8"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold sm:text-2xl">
              {category === "All"
                ? "Fresh recommendations"
                : category}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Discover your next great find.
            </p>
          </div>

          <button
            onClick={() => {
              setCategory("All");
              setSearch("");
            }}
            className="flex shrink-0 items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-semibold"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Reset filters</span>
          </button>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {filtered.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="relative flex h-36 items-center justify-center sm:h-48"
                  style={{ backgroundColor: product.color }}
                >
                  <span className="text-6xl transition-transform group-hover:scale-110 sm:text-7xl">
                    {product.emoji}
                  </span>

                  <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-1 text-[10px] font-bold sm:text-xs">
                    {product.condition}
                  </span>

                  <button
                    onClick={() => toggleFavorite(product.id)}
                    aria-label="Toggle favorite"
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm"
                  >
                    <Heart
                      size={18}
                      className={
                        favorites.includes(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-700"
                      }
                    />
                  </button>
                </div>

                <div className="p-3 sm:p-4">
                  <p className="text-xl font-extrabold">
                    {money(product.price)}
                  </p>

                  <h3 className="mt-1 truncate text-sm font-semibold sm:text-base">
                    {product.title}
                  </h3>

                  <p className="mt-2 text-xs text-gray-500">
                    {product.category}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-1 border-t pt-3 text-[10px] text-gray-500 sm:text-xs">
                    <span className="flex min-w-0 items-center gap-1 truncate">
                      <MapPin size={12} />
                      {product.location}
                    </span>
                    <span className="shrink-0">{product.date}</span>
                  </div>

                  <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#1767d2] py-2 text-sm font-bold text-[#1767d2] hover:bg-[#1767d2] hover:text-white">
                    <MessageCircle size={16} />
                    Contact seller
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-white px-4 py-12 text-center">
            <Search className="mx-auto text-gray-400" size={38} />

            <h3 className="mt-3 font-bold">No products found</h3>

            <p className="mt-1 text-sm text-gray-500">
              Try another search or category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-4 rounded-lg bg-[#1767d2] px-4 py-2 text-sm font-bold text-white"
            >
              Clear search
            </button>
          </div>
        )}
      </section>

      <section className="border-t bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:grid-cols-3 lg:px-8">
          <div className="flex items-center gap-3">
            <ShieldCheck
              className="shrink-0 text-[#1767d2]"
              size={28}
            />
            <div>
              <p className="font-bold">Your safety matters</p>
              <p className="text-xs text-gray-500">
                Meet carefully. Verify before paying.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Search className="shrink-0 text-[#1767d2]" size={28} />
            <div>
              <p className="font-bold">Find great deals</p>
              <p className="text-xs text-gray-500">
                Discover pre-loved products.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Heart className="shrink-0 text-[#1767d2]" size={28} />
            <div>
              <p className="font-bold">Give products a new life</p>
              <p className="text-xs text-gray-500">
                Sell what you no longer need.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#252b35] px-4 py-7 text-center text-sm text-white">
        <p className="text-xl font-black">
          SEL<span className="text-[#f39b27]">DOL</span>
        </p>

        <p className="mt-2 text-gray-300">Buy smart. Sell easy.</p>

        <p className="mt-4 text-xs text-gray-400">
          © {new Date().getFullYear()} SELDOL. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
