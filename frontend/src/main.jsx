import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  Flame,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  X
} from "lucide-react";
import { marketplaceSeed } from "./data/seed";
import "./styles/globals.css";

const categories = [
  "TikTok promotion",
  "YouTube promotion",
  "Instagram promotion",
  "YouTube account sales"
];

function money(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function App() {
  const [services, setServices] = useState(marketplaceSeed.services);
  const [posts, setPosts] = useState(marketplaceSeed.posts);
  const [ads, setAds] = useState(marketplaceSeed.ads);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeView, setActiveView] = useState("market");
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    category: categories[0],
    price: 1490
  });

  const approvedServices = useMemo(() => {
    return services.filter((service) => {
      const categoryMatch = selectedCategory === "All" || service.category === selectedCategory;
      return service.status === "approved" && categoryMatch;
    });
  }, [services, selectedCategory]);

  const activeAds = ads.filter((ad) => ad.active);
  const pendingCount = services.filter((service) => service.status === "pending").length;

  function createService(event) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.description.trim()) return;
    setServices((current) => [
      {
        id: crypto.randomUUID(),
        ...draft,
        ownerId: "u1",
        ownerName: "New Seller",
        ownerRating: 4.8,
        status: "pending",
        reviews: []
      },
      ...current
    ]);
    setDraft({ title: "", description: "", category: categories[0], price: 1490 });
    setActiveView("admin");
  }

  function publishPost() {
    setPosts((current) => [
      {
        id: crypto.randomUUID(),
        author: "New Seller",
        content: "Запускаю пакет продвижения с ручной аналитикой и отчетом по удержанию.",
        price: 200,
        active: true,
        createdAt: "just now"
      },
      ...current
    ]);
  }

  function approveService(id) {
    setServices((current) =>
      current.map((service) => (service.id === id ? { ...service, status: "approved" } : service))
    );
  }

  function rejectService(id) {
    setServices((current) =>
      current.map((service) => (service.id === id ? { ...service, status: "rejected" } : service))
    );
  }

  function deletePost(id) {
    setPosts((current) => current.filter((post) => post.id !== id));
  }

  function toggleAd(id) {
    setAds((current) => current.map((ad) => (ad.id === id ? { ...ad, active: !ad.active } : ad)));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-ink text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(139,92,246,0.26),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(56,189,248,0.18),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(244,114,182,0.13),transparent_30%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <TopNav pendingCount={pendingCount} activeView={activeView} setActiveView={setActiveView} />
        <Hero activeAds={activeAds} />
        <Stats />
        <Tabs activeView={activeView} setActiveView={setActiveView} />

        <AnimatePresence mode="wait">
          {activeView === "market" && (
            <motion.section
              key="market"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="grid gap-6 xl:grid-cols-[1fr_360px]"
            >
              <div className="space-y-5">
                <CategoryRail selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                <ServiceGrid services={approvedServices} />
              </div>
              <CreateServicePanel draft={draft} setDraft={setDraft} createService={createService} />
            </motion.section>
          )}

          {activeView === "feed" && (
            <motion.section
              key="feed"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="grid gap-6 lg:grid-cols-[1fr_340px]"
            >
              <Feed posts={posts} deletePost={deletePost} />
              <SidePanel publishPost={publishPost} />
            </motion.section>
          )}

          {activeView === "admin" && (
            <motion.section
              key="admin"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <AdminPanel
                services={services}
                posts={posts}
                ads={ads}
                approveService={approveService}
                rejectService={rejectService}
                deletePost={deletePost}
                toggleAd={toggleAd}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function TopNav({ pendingCount, activeView, setActiveView }) {
  return (
    <header className="sticky top-3 z-20 flex items-center justify-between rounded-lg border border-line bg-white/8 px-4 py-3 shadow-card backdrop-blur-xl">
      <button className="flex items-center gap-3" onClick={() => setActiveView("market")}>
        <span className="grid size-10 place-items-center rounded-lg bg-gradient-to-br from-violet via-electric to-rose shadow-glow">
          <Sparkles className="size-5" />
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-lg font-black leading-none">PulseMarket</span>
          <span className="text-xs text-white/55">hybrid social commerce</span>
        </span>
      </button>

      <div className="hidden items-center gap-2 rounded-lg border border-line bg-black/20 px-3 py-2 md:flex">
        <Search className="size-4 text-white/45" />
        <input
          className="w-72 bg-transparent text-sm outline-none placeholder:text-white/35"
          placeholder="Search services, accounts, ads"
        />
      </div>

      <nav className="flex items-center gap-2">
        <IconButton label="Support" href="https://t.me/support">
          <LifeBuoy className="size-4" />
        </IconButton>
        <button
          className={`relative grid size-10 place-items-center rounded-lg border border-line transition hover:bg-white/12 ${
            activeView === "admin" ? "bg-white/15" : "bg-white/5"
          }`}
          title="Admin"
          onClick={() => setActiveView("admin")}
        >
          <LayoutDashboard className="size-4" />
          {pendingCount > 0 && (
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-rose text-[10px] font-bold">
              {pendingCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
}

function IconButton({ label, href, children }) {
  return (
    <a
      className="grid size-10 place-items-center rounded-lg border border-line bg-white/5 transition hover:bg-white/12"
      title={label}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

function Hero({ activeAds }) {
  const primaryAd = activeAds[0];
  return (
    <section className="grid min-h-[380px] overflow-hidden rounded-lg border border-line bg-[linear-gradient(135deg,rgba(17,19,34,0.94),rgba(14,15,27,0.62)),url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center shadow-glow lg:grid-cols-[1.15fr_0.85fr]">
      <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
        <div className="flex w-fit items-center gap-2 rounded-full border border-line bg-white/10 px-3 py-1 text-xs font-semibold text-white/75 backdrop-blur">
          <Flame className="size-4 text-rose" />
          Premium services marketplace
        </div>
        <div className="max-w-3xl">
          <h1 className="text-4xl font-black leading-[0.98] sm:text-6xl lg:text-7xl">
            PulseMarket
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
            Marketplace for TikTok, YouTube, Instagram growth, YouTube account deals,
            paid posts, banner ads, and moderated seller listings.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-ink transition hover:scale-[1.02]" href="#services">
            Explore deals <ChevronRight className="size-4" />
          </a>
          <a className="inline-flex items-center gap-2 rounded-lg border border-line bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/16" href="https://t.me/support" target="_blank" rel="noreferrer">
            Telegram support <LifeBuoy className="size-4" />
          </a>
        </div>
      </div>
      <div className="flex items-end p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-lg border border-line bg-black/35 p-5 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-bold text-white/75">Rotating banner ad</span>
            <span className="rounded-full bg-electric/15 px-3 py-1 text-xs font-bold text-electric">
              2500 ₽ / 48h
            </span>
          </div>
          <h2 className="text-2xl font-black">{primaryAd?.title ?? "Ad slot available"}</h2>
          <p className="mt-2 text-sm leading-6 text-white/62">{primaryAd?.copy ?? "Launch a featured promotion with admin-controlled rotation."}</p>
        </motion.div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    ["Listing fee", "250 ₽", CreditCard],
    ["Feed post", "200 ₽", Bell],
    ["Banner", "48 hours", Clock3],
    ["Moderation", "Required", ShieldCheck]
  ];
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(([label, value, Icon]) => (
        <div key={label} className="rounded-lg border border-line bg-white/7 p-4 shadow-card backdrop-blur">
          <Icon className="mb-4 size-5 text-electric" />
          <p className="text-sm text-white/50">{label}</p>
          <p className="mt-1 text-2xl font-black">{value}</p>
        </div>
      ))}
    </section>
  );
}

function Tabs({ activeView, setActiveView }) {
  const tabs = [
    ["market", "Marketplace"],
    ["feed", "Ads Feed"],
    ["admin", "Admin"]
  ];
  return (
    <div className="flex w-full gap-2 overflow-x-auto rounded-lg border border-line bg-white/6 p-1 backdrop-blur">
      {tabs.map(([id, label]) => (
        <button
          key={id}
          className={`min-w-32 flex-1 rounded-md px-4 py-3 text-sm font-bold transition ${
            activeView === id ? "bg-white text-ink" : "text-white/62 hover:bg-white/10 hover:text-white"
          }`}
          onClick={() => setActiveView(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function CategoryRail({ selectedCategory, setSelectedCategory }) {
  return (
    <div id="services" className="flex gap-2 overflow-x-auto pb-1">
      {["All", ...categories].map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`whitespace-nowrap rounded-lg border px-4 py-3 text-sm font-bold transition ${
            selectedCategory === category
              ? "border-white bg-white text-ink"
              : "border-line bg-white/6 text-white/66 hover:bg-white/12"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

function ServiceGrid({ services }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {services.map((service) => (
        <motion.article
          key={service.id}
          whileHover={{ y: -4 }}
          className="rounded-lg border border-line bg-white/8 p-5 shadow-card backdrop-blur"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="rounded-full bg-violet/18 px-3 py-1 text-xs font-bold text-violet">
              {service.category}
            </span>
            <span className="text-xl font-black">{money(service.price)}</span>
          </div>
          <h3 className="mt-4 text-xl font-black">{service.title}</h3>
          <p className="mt-2 min-h-16 text-sm leading-6 text-white/62">{service.description}</p>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold">
                {service.ownerName}
                <BadgeCheck className="size-4 text-electric" />
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-white/50">
                <Star className="size-3 fill-rose text-rose" /> {service.ownerRating}
                <span>• {service.reviews.length} reviews</span>
              </div>
            </div>
            <button className="rounded-lg bg-gradient-to-r from-violet via-electric to-rose px-4 py-2 text-sm font-black text-white transition hover:scale-[1.03]">
              Buy
            </button>
          </div>
          {service.reviews[0] && (
            <blockquote className="mt-4 rounded-lg border border-line bg-black/20 p-3 text-sm text-white/58">
              “{service.reviews[0].text}”
            </blockquote>
          )}
        </motion.article>
      ))}
    </div>
  );
}

function CreateServicePanel({ draft, setDraft, createService }) {
  return (
    <aside className="h-fit rounded-lg border border-line bg-white/8 p-5 shadow-card backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-black">Create service</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/62">250 ₽</span>
      </div>
      <form className="space-y-4" onSubmit={createService}>
        <Field label="Title">
          <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="YouTube Shorts boost" />
        </Field>
        <Field label="Category">
          <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </Field>
        <Field label="Price">
          <input type="number" min="100" value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} />
        </Field>
        <Field label="Description">
          <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="What buyer receives, delivery time, guarantees" rows={4} />
        </Field>
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-ink transition hover:scale-[1.02]">
          <Plus className="size-4" /> Submit for moderation
        </button>
      </form>
    </aside>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm font-bold text-white/66">
      <span className="mb-2 block">{label}</span>
      {children}
    </label>
  );
}

function Feed({ posts, deletePost }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article key={post.id} className="rounded-lg border border-line bg-white/8 p-5 shadow-card backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-black">{post.author}</h3>
              <p className="text-xs text-white/42">{post.createdAt}</p>
            </div>
            <span className="rounded-full bg-rose/16 px-3 py-1 text-xs font-black text-rose">{money(post.price)}</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-white/70">{post.content}</p>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <button className="inline-flex items-center gap-2 rounded-lg border border-line bg-white/8 px-4 py-2 text-sm font-bold hover:bg-white/14">
              <Megaphone className="size-4" /> Promote
            </button>
            <button className="grid size-9 place-items-center rounded-lg border border-line bg-white/6 hover:bg-rose/16" title="Delete post" onClick={() => deletePost(post.id)}>
              <Trash2 className="size-4" />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function SidePanel({ publishPost }) {
  return (
    <aside className="h-fit rounded-lg border border-line bg-white/8 p-5 shadow-card backdrop-blur">
      <h2 className="text-xl font-black">Paid posts</h2>
      <p className="mt-2 text-sm leading-6 text-white/58">
        Users publish social marketplace posts for discovery, updates, and limited offers.
      </p>
      <button onClick={publishPost} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-ink">
        <Plus className="size-4" /> Publish demo post
      </button>
    </aside>
  );
}

function AdminPanel({ services, posts, ads, approveService, rejectService, deletePost, toggleAd }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <AdminColumn title="Service moderation">
        {services.map((service) => (
          <AdminItem key={service.id} title={service.title} meta={`${service.category} • ${service.status}`}>
            <button onClick={() => approveService(service.id)} className="admin-action bg-emerald-400/18 text-emerald-300"><Check className="size-4" /></button>
            <button onClick={() => rejectService(service.id)} className="admin-action bg-rose/18 text-rose"><X className="size-4" /></button>
          </AdminItem>
        ))}
      </AdminColumn>
      <AdminColumn title="Feed posts">
        {posts.map((post) => (
          <AdminItem key={post.id} title={post.author} meta={post.content}>
            <button onClick={() => deletePost(post.id)} className="admin-action bg-rose/18 text-rose"><Trash2 className="size-4" /></button>
          </AdminItem>
        ))}
      </AdminColumn>
      <AdminColumn title="Banner ads">
        {ads.map((ad) => (
          <AdminItem key={ad.id} title={ad.title} meta={ad.active ? "Active rotation" : "Paused"}>
            <button onClick={() => toggleAd(ad.id)} className="admin-action bg-electric/18 text-electric">
              {ad.active ? <X className="size-4" /> : <Check className="size-4" />}
            </button>
          </AdminItem>
        ))}
      </AdminColumn>
    </div>
  );
}

function AdminColumn({ title, children }) {
  return (
    <section className="rounded-lg border border-line bg-white/8 p-5 shadow-card backdrop-blur">
      <h2 className="mb-4 text-xl font-black">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function AdminItem({ title, meta, children }) {
  return (
    <div className="rounded-lg border border-line bg-black/20 p-4">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/48">{meta}</p>
      <div className="mt-3 flex gap-2">{children}</div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
