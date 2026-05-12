import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
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
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Users,
  X
} from "lucide-react";
import { marketplaceSeed } from "./data/seed";
import "./styles/globals.css";

const SUPPORT_URL = "https://t.me/Seagullstol";
const COMMUNITY_URL = "https://t.me/rulegek";

const categories = [
  "Продвижение TikTok",
  "Продвижение YouTube",
  "Продвижение Instagram",
  "Продажа YouTube-аккаунтов"
];

const statusLabels = {
  pending: "на модерации",
  approved: "одобрено",
  rejected: "отклонено"
};

function money(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function App() {
  const [services, setServices] = useState(marketplaceSeed.services);
  const [posts, setPosts] = useState(marketplaceSeed.posts);
  const [ads, setAds] = useState(marketplaceSeed.ads);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [activeView, setActiveView] = useState("market");
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    category: categories[0],
    price: 1490
  });

  const approvedServices = useMemo(() => {
    return services.filter((service) => {
      const categoryMatch = selectedCategory === "Все" || service.category === selectedCategory;
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
        ownerName: "Новый продавец",
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
        author: "Новый продавец",
        content: "Запускаю пакет продвижения с ручной аналитикой и отчетом по удержанию аудитории.",
        price: 200,
        active: true,
        createdAt: "только что"
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
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:gap-6 sm:px-6 lg:px-8">
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
              className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"
            >
              <div className="min-w-0 space-y-5">
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
              className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
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

          {activeView === "contacts" && (
            <motion.section
              key="contacts"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <Contacts />
            </motion.section>
          )}
        </AnimatePresence>

        <Footer setActiveView={setActiveView} />
      </div>
    </main>
  );
}

function TopNav({ pendingCount, activeView, setActiveView }) {
  return (
    <header className="sticky top-3 z-20 grid gap-3 rounded-lg border border-line bg-white/8 px-3 py-3 shadow-card backdrop-blur-xl sm:px-4 lg:grid-cols-[auto_minmax(220px,1fr)_auto] lg:items-center">
      <div className="flex items-center justify-between gap-3">
        <button className="flex min-w-0 items-center gap-3" onClick={() => setActiveView("market")}>
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet via-electric to-rose shadow-glow">
            <Sparkles className="size-5" />
          </span>
          <span className="min-w-0 text-left">
            <span className="block truncate text-base font-black leading-none sm:text-lg">PulseMarket</span>
            <span className="text-xs text-white/55">маркетплейс digital-услуг</span>
          </span>
        </button>

        <button
          className={`relative grid size-10 shrink-0 place-items-center rounded-lg border border-line transition hover:bg-white/12 lg:hidden ${
            activeView === "admin" ? "bg-white/15" : "bg-white/5"
          }`}
          title="Админ-панель"
          onClick={() => setActiveView("admin")}
        >
          <LayoutDashboard className="size-4" />
          {pendingCount > 0 && <CounterBadge count={pendingCount} />}
        </button>
      </div>

      <div className="flex min-w-0 items-center gap-2 rounded-lg border border-line bg-black/20 px-3 py-2">
        <Search className="size-4 shrink-0 text-white/45" />
        <input
          className="min-w-0 bg-transparent p-0 text-sm outline-none placeholder:text-white/35"
          placeholder="Поиск услуг, аккаунтов и объявлений"
        />
      </div>

      <nav className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
        <TextLinkButton label="Поддержка" href={SUPPORT_URL}>
          <LifeBuoy className="size-4" />
        </TextLinkButton>
        <TextLinkButton label="Сообщество" href={COMMUNITY_URL}>
          <Users className="size-4" />
        </TextLinkButton>
        <button
          className={`relative hidden min-h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm font-bold transition hover:bg-white/12 lg:inline-flex ${
            activeView === "admin" ? "bg-white/15" : "bg-white/5"
          }`}
          title="Админ-панель"
          onClick={() => setActiveView("admin")}
        >
          <LayoutDashboard className="size-4" />
          Админ
          {pendingCount > 0 && <CounterBadge count={pendingCount} />}
        </button>
      </nav>
    </header>
  );
}

function CounterBadge({ count }) {
  return (
    <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-rose text-[10px] font-bold">
      {count}
    </span>
  );
}

function TextLinkButton({ label, href, children }) {
  return (
    <a
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line bg-white/5 px-3 text-sm font-bold transition hover:bg-white/12"
      title={label}
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <span>{label}</span>
    </a>
  );
}

function Hero({ activeAds }) {
  const primaryAd = activeAds[0];
  return (
    <section className="grid min-h-[420px] overflow-hidden rounded-lg border border-line bg-[linear-gradient(135deg,rgba(17,19,34,0.94),rgba(14,15,27,0.62)),url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center shadow-glow lg:grid-cols-[1.15fr_0.85fr]">
      <div className="flex flex-col justify-between gap-8 p-5 sm:p-8 lg:p-10">
        <div className="flex w-fit items-center gap-2 rounded-full border border-line bg-white/10 px-3 py-1 text-xs font-semibold text-white/75 backdrop-blur">
          <Flame className="size-4 text-rose" />
          Премиальный маркетплейс услуг
        </div>
        <div className="max-w-3xl">
          <h1 className="text-4xl font-black leading-[0.98] sm:text-6xl lg:text-7xl">PulseMarket</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
            Платформа для продвижения TikTok, YouTube и Instagram, продажи YouTube-аккаунтов,
            платных объявлений, рекламных баннеров и модерируемых услуг продавцов.
          </p>
        </div>
        <div className="grid gap-3 sm:flex sm:flex-wrap">
          <a className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-ink transition hover:scale-[1.02]" href="#services">
            Смотреть услуги <ChevronRight className="size-4" />
          </a>
          <a className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/16" href={SUPPORT_URL} target="_blank" rel="noreferrer">
            Поддержка <LifeBuoy className="size-4" />
          </a>
          <a className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/16" href={COMMUNITY_URL} target="_blank" rel="noreferrer">
            Сообщество <Users className="size-4" />
          </a>
        </div>
      </div>
      <div className="flex items-end p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-lg border border-line bg-black/35 p-5 backdrop-blur-xl"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-white/75">Рекламный баннер в ротации</span>
            <span className="rounded-full bg-electric/15 px-3 py-1 text-xs font-bold text-electric">
              2500 ₽ / 48 часов
            </span>
          </div>
          <h2 className="text-2xl font-black">{primaryAd?.title ?? "Свободное рекламное место"}</h2>
          <p className="mt-2 text-sm leading-6 text-white/62">
            {primaryAd?.copy ?? "Запустите премиальное размещение с управляемой ротацией в админ-панели."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    ["Размещение услуги", "250 ₽", CreditCard],
    ["Пост в ленте", "200 ₽", Bell],
    ["Баннер", "48 часов", Clock3],
    ["Модерация", "обязательна", ShieldCheck]
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
    ["market", "Маркетплейс"],
    ["feed", "Лента объявлений"],
    ["admin", "Админ-панель"],
    ["contacts", "Контакты"]
  ];
  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg border border-line bg-white/6 p-1 backdrop-blur md:flex md:overflow-x-auto">
      {tabs.map(([id, label]) => (
        <button
          key={id}
          className={`min-h-11 rounded-md px-3 text-sm font-bold transition md:min-w-36 md:flex-1 ${
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
      {["Все", ...categories].map((category) => (
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
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span className="rounded-full bg-violet/18 px-3 py-1 text-xs font-bold text-violet">
              {service.category}
            </span>
            <span className="text-xl font-black">{money(service.price)}</span>
          </div>
          <h3 className="mt-4 text-xl font-black">{service.title}</h3>
          <p className="mt-2 min-h-16 text-sm leading-6 text-white/62">{service.description}</p>
          <div className="mt-5 flex flex-col gap-4 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold">
                {service.ownerName}
                <BadgeCheck className="size-4 text-electric" />
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-white/50">
                <Star className="size-3 fill-rose text-rose" /> {service.ownerRating}
                <span>• {service.reviews.length} отзывов</span>
              </div>
            </div>
            <button className="rounded-lg bg-gradient-to-r from-violet via-electric to-rose px-4 py-2 text-sm font-black text-white transition hover:scale-[1.03]">
              Купить
            </button>
          </div>
          {service.reviews[0] && (
            <blockquote className="mt-4 rounded-lg border border-line bg-black/20 p-3 text-sm text-white/58">
              «{service.reviews[0].text}»
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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-black">Создать услугу</h2>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/62">250 ₽</span>
      </div>
      <form className="space-y-4" onSubmit={createService}>
        <Field label="Название">
          <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Продвижение YouTube Shorts" />
        </Field>
        <Field label="Категория">
          <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </Field>
        <Field label="Цена">
          <input type="number" min="100" value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} />
        </Field>
        <Field label="Описание">
          <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Что получает покупатель, сроки, гарантии" rows={4} />
        </Field>
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-ink transition hover:scale-[1.02]">
          <Plus className="size-4" /> Отправить на модерацию
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
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-black">{post.author}</h3>
              <p className="text-xs text-white/42">{post.createdAt}</p>
            </div>
            <span className="rounded-full bg-rose/16 px-3 py-1 text-xs font-black text-rose">{money(post.price)}</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-white/70">{post.content}</p>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <button className="inline-flex items-center gap-2 rounded-lg border border-line bg-white/8 px-4 py-2 text-sm font-bold hover:bg-white/14">
              <Megaphone className="size-4" /> Продвигать
            </button>
            <button className="grid size-9 place-items-center rounded-lg border border-line bg-white/6 hover:bg-rose/16" title="Удалить пост" onClick={() => deletePost(post.id)}>
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
      <h2 className="text-xl font-black">Платные посты</h2>
      <p className="mt-2 text-sm leading-6 text-white/58">
        Пользователи публикуют объявления для обновлений, предложений и быстрого поиска покупателей.
      </p>
      <button onClick={publishPost} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-ink">
        <Plus className="size-4" /> Опубликовать демо-пост
      </button>
    </aside>
  );
}

function AdminPanel({ services, posts, ads, approveService, rejectService, deletePost, toggleAd }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <AdminColumn title="Модерация услуг">
        {services.map((service) => (
          <AdminItem key={service.id} title={service.title} meta={`${service.category} • ${statusLabels[service.status] ?? service.status}`}>
            <button onClick={() => approveService(service.id)} className="admin-action bg-emerald-400/18 text-emerald-300" title="Одобрить"><Check className="size-4" /></button>
            <button onClick={() => rejectService(service.id)} className="admin-action bg-rose/18 text-rose" title="Отклонить"><X className="size-4" /></button>
          </AdminItem>
        ))}
      </AdminColumn>
      <AdminColumn title="Посты в ленте">
        {posts.map((post) => (
          <AdminItem key={post.id} title={post.author} meta={post.content}>
            <button onClick={() => deletePost(post.id)} className="admin-action bg-rose/18 text-rose" title="Удалить"><Trash2 className="size-4" /></button>
          </AdminItem>
        ))}
      </AdminColumn>
      <AdminColumn title="Рекламные баннеры">
        {ads.map((ad) => (
          <AdminItem key={ad.id} title={ad.title} meta={ad.active ? "Активная ротация" : "Остановлено"}>
            <button onClick={() => toggleAd(ad.id)} className="admin-action bg-electric/18 text-electric" title={ad.active ? "Остановить" : "Включить"}>
              {ad.active ? <X className="size-4" /> : <Check className="size-4" />}
            </button>
          </AdminItem>
        ))}
      </AdminColumn>
    </div>
  );
}

function Contacts() {
  return (
    <section id="contacts" className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-lg border border-line bg-white/8 p-6 shadow-card backdrop-blur">
        <p className="text-sm font-bold text-electric">Контакты</p>
        <h2 className="mt-3 text-3xl font-black">Связь с поддержкой и сообществом</h2>
        <p className="mt-4 text-sm leading-7 text-white/62">
          Если нужно уточнить правила размещения, модерацию, рекламу или работу маркетплейса,
          напишите в Telegram-поддержку. Для новостей и общения переходите в сообщество.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ContactCard
          title="Поддержка"
          text="@Seagullstol"
          href={SUPPORT_URL}
          icon={<LifeBuoy className="size-5" />}
        />
        <ContactCard
          title="Сообщество"
          text="t.me/rulegek"
          href={COMMUNITY_URL}
          icon={<MessageCircle className="size-5" />}
        />
      </div>
    </section>
  );
}

function ContactCard({ title, text, href, icon }) {
  return (
    <a
      className="flex min-h-48 flex-col justify-between rounded-lg border border-line bg-white/8 p-5 shadow-card backdrop-blur transition hover:-translate-y-1 hover:bg-white/12"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <span className="grid size-11 place-items-center rounded-lg bg-gradient-to-br from-violet via-electric to-rose">
        {icon}
      </span>
      <span>
        <span className="block text-xl font-black">{title}</span>
        <span className="mt-2 block text-sm text-white/58">{text}</span>
      </span>
    </a>
  );
}

function Footer({ setActiveView }) {
  return (
    <footer className="grid gap-5 rounded-lg border border-line bg-white/6 p-5 text-sm text-white/58 backdrop-blur md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <p className="font-black text-white">PulseMarket</p>
        <p className="mt-1">Маркетплейс digital-услуг, объявлений и рекламных размещений.</p>
      </div>
      <div className="grid gap-2 sm:flex">
        <button className="rounded-lg border border-line bg-white/5 px-4 py-2 font-bold text-white transition hover:bg-white/12" onClick={() => setActiveView("contacts")}>
          Контакты
        </button>
        <a className="rounded-lg border border-line bg-white/5 px-4 py-2 font-bold text-white transition hover:bg-white/12" href={SUPPORT_URL} target="_blank" rel="noreferrer">
          Поддержка
        </a>
        <a className="rounded-lg border border-line bg-white/5 px-4 py-2 font-bold text-white transition hover:bg-white/12" href={COMMUNITY_URL} target="_blank" rel="noreferrer">
          Сообщество
        </a>
      </div>
    </footer>
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
