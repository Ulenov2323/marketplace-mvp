import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Bell,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  Flame,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  LogIn,
  LogOut,
  Megaphone,
  MessageCircle,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Trash2,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
  WalletCards,
  X,
  Zap
} from "lucide-react";
import { authApi } from "./api/authApi";
import { marketplaceApi } from "./api/marketplaceApi";
import { servicesApi } from "./api/servicesApi";
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

const protectedViews = {
  admin: ["admin"],
  seller: ["seller", "admin"]
};

function money(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function App() {
  const [services, setServices] = useState([]);
  const [posts, setPosts] = useState([]);
  const [ads, setAds] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [activeView, setActiveView] = useState("market");
  const [intendedView, setIntendedView] = useState("market");
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    category: categories[0],
    price: 1490
  });

  const currentUser = session?.user ?? { role: "guest", name: "Гость" };
  const role = currentUser.role;
  const isAdmin = role === "admin";
  const canSell = role === "seller" || role === "admin";

  useEffect(() => {
    async function loadInitialData() {
      const [marketplace, currentSession] = await Promise.all([
        marketplaceApi.bootstrap(),
        authApi.getSession()
      ]);

      setServices(marketplace.services);
      setPosts(marketplace.posts);
      setAds(marketplace.ads);
      setSellers(marketplace.sellers);
      setTestimonials(marketplace.testimonials);
      setSession(currentSession);
      setIsLoading(false);
    }

    loadInitialData();
  }, []);

  const approvedServices = useMemo(() => {
    return services.filter((service) => {
      const categoryMatch = selectedCategory === "Все" || service.category === selectedCategory;
      return service.status === "approved" && categoryMatch;
    });
  }, [services, selectedCategory]);

  const activeAds = ads.filter((ad) => ad.active);
  const pendingCount = services.filter((service) => service.status === "pending").length;
  const selectedService = services.find((service) => service.id === selectedServiceId);
  const popularServices = services
    .filter((service) => service.status === "approved")
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 3);

  function hasAccess(view, userRole = role) {
    const allowedRoles = protectedViews[view];
    return !allowedRoles || allowedRoles.includes(userRole);
  }

  function navigate(view) {
    if (!hasAccess(view)) {
      setIntendedView(view);
      setAuthMode("login");
      setActiveView("login");
      return;
    }

    setActiveView(view);
  }

  async function login(credentials) {
    const nextSession = await authApi.login(credentials);
    setSession(nextSession);
    setActiveView(hasAccess(intendedView, nextSession.user.role) ? intendedView : "market");
  }

  async function register(payload) {
    const nextSession = await authApi.register(payload);
    setSession(nextSession);
    setActiveView(hasAccess(intendedView, nextSession.user.role) ? intendedView : "market");
  }

  async function logout() {
    await authApi.logout();
    setSession(null);
    setActiveView("market");
  }

  async function createService(event) {
    event.preventDefault();
    if (!canSell) {
      setIntendedView("seller");
      setAuthMode("login");
      setActiveView("login");
      return;
    }
    if (!draft.title.trim() || !draft.description.trim()) return;

    const service = await servicesApi.create(draft, currentUser);
    setServices((current) => [service, ...current]);
    setDraft({ title: "", description: "", category: categories[0], price: 1490 });
    setActiveView(isAdmin ? "admin" : "market");
  }

  async function publishPost() {
    if (!canSell) {
      setIntendedView("seller");
      setAuthMode("login");
      setActiveView("login");
      return;
    }

    const post = await marketplaceApi.createPost(currentUser);
    setPosts((current) => [post, ...current]);
  }

  async function approveService(id) {
    const service = await servicesApi.approve(id);
    setServices((current) => current.map((item) => (item.id === id ? service : item)));
  }

  async function rejectService(id) {
    const service = await servicesApi.reject(id);
    setServices((current) => current.map((item) => (item.id === id ? service : item)));
  }

  async function deletePost(id) {
    await marketplaceApi.deletePost(id);
    setPosts((current) => current.filter((post) => post.id !== id));
  }

  async function toggleAd(id) {
    const ad = await marketplaceApi.toggleAd(id);
    setAds((current) => current.map((item) => (item.id === id ? ad : item)));
  }

  function openService(serviceId) {
    setSelectedServiceId(serviceId);
    setActiveView("service");
  }

  function closeService() {
    setSelectedServiceId(null);
    setActiveView("market");
  }

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink text-white">
        <div className="rounded-lg border border-line bg-white/8 p-6 shadow-card backdrop-blur">
          <Sparkles className="mb-4 size-8 text-electric" />
          <p className="text-xl font-black">Загружаем marketplace...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-ink pb-20 text-white lg:pb-0">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(139,92,246,0.24),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(56,189,248,0.18),transparent_26%),radial-gradient(circle_at_50%_84%,rgba(244,114,182,0.12),transparent_30%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-4 sm:gap-6 sm:px-6 lg:px-8">
        <TopNav
          pendingCount={pendingCount}
          activeView={activeView}
          navigate={navigate}
          session={session}
          logout={logout}
        />
        <Hero activeAds={activeAds} navigate={navigate} />
        <Stats />
        <Tabs activeView={activeView} navigate={navigate} />

        <AnimatePresence mode="wait">
          {activeView === "market" && (
            <motion.section
              key="market"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              <MarketplaceHighlights
                popularServices={popularServices}
                sellers={sellers}
                testimonials={testimonials}
                activeAds={activeAds}
              />
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="min-w-0 space-y-5">
                  <SectionHeader
                    eyebrow="Каталог"
                    title="Услуги маркетплейса"
                    text="Выбирайте проверенные предложения по продвижению, аккаунтам и рекламе."
                  />
                  <CategoryRail selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                  <ServiceGrid services={approvedServices} onOpenService={openService} />
                </div>
                <CreateServicePanel
                  draft={draft}
                  setDraft={setDraft}
                  createService={createService}
                  canSell={canSell}
                  navigate={navigate}
                />
              </div>
            </motion.section>
          )}

          {activeView === "service" && selectedService && (
            <motion.section key="service" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <ServiceDetail
                service={selectedService}
                relatedServices={popularServices.filter((service) => service.id !== selectedService.id)}
                onBack={closeService}
                onOpenService={openService}
                session={session}
                navigate={navigate}
              />
            </motion.section>
          )}

          {activeView === "feed" && (
            <motion.section key="feed" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              <Feed posts={posts} deletePost={deletePost} canManage={isAdmin} />
              <SidePanel publishPost={publishPost} canSell={canSell} />
            </motion.section>
          )}

          {activeView === "admin" && isAdmin && (
            <motion.section key="admin" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
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
            <motion.section key="contacts" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <Contacts />
            </motion.section>
          )}

          {(activeView === "login" || activeView === "register") && (
            <motion.section key="auth" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <AuthScreen
                mode={authMode}
                setMode={setAuthMode}
                login={login}
                register={register}
                intendedView={intendedView}
              />
            </motion.section>
          )}
        </AnimatePresence>

        <Footer navigate={navigate} />
      </div>
      <MobileBottomNav activeView={activeView} navigate={navigate} pendingCount={pendingCount} />
    </main>
  );
}

function TopNav({ pendingCount, activeView, navigate, session, logout }) {
  return (
    <header className="sticky top-3 z-20 grid gap-3 rounded-lg border border-line bg-white/8 px-3 py-3 shadow-card backdrop-blur-xl sm:px-4 lg:grid-cols-[auto_minmax(220px,1fr)_auto] lg:items-center">
      <div className="flex items-center justify-between gap-3">
        <button className="flex min-w-0 items-center gap-3" onClick={() => navigate("market")}>
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
          onClick={() => navigate("admin")}
        >
          <LayoutDashboard className="size-4" />
          {pendingCount > 0 && <CounterBadge count={pendingCount} />}
        </button>
      </div>

      <div className="flex min-w-0 items-center gap-2 rounded-lg border border-line bg-black/20 px-3 py-2">
        <Search className="size-4 shrink-0 text-white/45" />
        <input className="min-w-0 bg-transparent p-0 text-sm outline-none placeholder:text-white/35" placeholder="Поиск услуг, аккаунтов и объявлений" />
      </div>

      <nav className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
        <TextLinkButton label="Поддержка" href={SUPPORT_URL}><LifeBuoy className="size-4" /></TextLinkButton>
        <TextLinkButton label="Сообщество" href={COMMUNITY_URL}><Users className="size-4" /></TextLinkButton>
        {session ? (
          <button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line bg-white/5 px-3 text-sm font-bold transition hover:bg-white/12" onClick={logout}>
            <LogOut className="size-4" />
            {session.user.name}
          </button>
        ) : (
          <button className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line bg-white/5 px-3 text-sm font-bold transition hover:bg-white/12" onClick={() => navigate("login")}>
            <LogIn className="size-4" />
            Войти
          </button>
        )}
        <button
          className={`relative hidden min-h-10 items-center justify-center gap-2 rounded-lg border border-line px-3 text-sm font-bold transition hover:bg-white/12 lg:inline-flex ${
            activeView === "admin" ? "bg-white/15" : "bg-white/5"
          }`}
          onClick={() => navigate("admin")}
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
  return <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-rose text-[10px] font-bold">{count}</span>;
}

function TextLinkButton({ label, href, children }) {
  return (
    <a className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line bg-white/5 px-3 text-sm font-bold transition hover:bg-white/12" title={label} href={href} target="_blank" rel="noreferrer">
      {children}
      <span>{label}</span>
    </a>
  );
}

function Hero({ activeAds, navigate }) {
  const primaryAd = activeAds[0];
  return (
    <section className="relative grid min-h-[520px] overflow-hidden rounded-lg border border-line bg-[linear-gradient(135deg,rgba(8,9,20,0.96),rgba(14,15,27,0.68)),url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center shadow-glow lg:grid-cols-[1.08fr_0.92fr]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <div className="flex flex-col justify-between gap-8 p-5 sm:p-8 lg:p-10">
        <div className="flex w-fit items-center gap-2 rounded-full border border-line bg-white/10 px-3 py-1 text-xs font-semibold text-white/75 backdrop-blur">
          <Flame className="size-4 text-rose" />
          Premium marketplace для digital-услуг
        </div>
        <div className="max-w-3xl">
          <h1 className="max-w-4xl text-4xl font-black leading-[0.98] sm:text-6xl lg:text-7xl">
            Покупайте продвижение и аккаунты в одном маркетплейсе
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
            PulseMarket объединяет услуги TikTok, YouTube, Instagram, продажу YouTube-аккаунтов,
            платные объявления и рекламные баннеры с модерацией и поддержкой в Telegram.
          </p>
        </div>
        <div className="grid gap-3 sm:flex sm:flex-wrap">
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black text-ink transition hover:scale-[1.02]" onClick={() => navigate("market")}>
            Перейти в маркетплейс <ChevronRight className="size-4" />
          </button>
          <a className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/16" href={SUPPORT_URL} target="_blank" rel="noreferrer">
            Связаться с поддержкой <LifeBuoy className="size-4" />
          </a>
        </div>
      </div>
      <div className="grid content-end gap-4 p-4 sm:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-line bg-black/38 p-5 backdrop-blur-xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-white/75">Рекламный баннер в ротации</span>
            <span className="rounded-full bg-electric/15 px-3 py-1 text-xs font-bold text-electric">2500 ₽ / 48 часов</span>
          </div>
          <h2 className="text-2xl font-black">{primaryAd?.title ?? "Свободное рекламное место"}</h2>
          <p className="mt-2 text-sm leading-6 text-white/62">{primaryAd?.copy ?? "Запустите премиальное размещение с управляемой ротацией в админ-панели."}</p>
        </motion.div>
        <div className="grid gap-3 sm:grid-cols-3">
          <HeroMetric value="4.8/5" label="средний рейтинг" />
          <HeroMetric value="48ч" label="реклама на главной" />
          <HeroMetric value="250₽" label="размещение услуги" />
        </div>
      </div>
    </section>
  );
}

function HeroMetric({ value, label }) {
  return <div className="rounded-lg border border-line bg-white/9 p-4 backdrop-blur"><p className="text-2xl font-black">{value}</p><p className="mt-1 text-xs text-white/52">{label}</p></div>;
}

function Stats() {
  const stats = [
    ["Размещение услуги", "250 ₽", CreditCard],
    ["Пост в ленте", "200 ₽", Bell],
    ["Баннер", "48 часов", Clock3],
    ["Модерация", "обязательна", ShieldCheck]
  ];
  return <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{stats.map(([label, value, Icon]) => <motion.div key={label} whileHover={{ y: -3 }} className="rounded-lg border border-line bg-white/7 p-4 shadow-card backdrop-blur"><Icon className="mb-4 size-5 text-electric" /><p className="text-sm text-white/50">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></motion.div>)}</section>;
}

function Tabs({ activeView, navigate }) {
  const tabs = [
    ["market", "Маркетплейс"],
    ["feed", "Лента объявлений"],
    ["admin", "Админ-панель"],
    ["contacts", "Контакты"]
  ];
  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg border border-line bg-white/6 p-1 backdrop-blur md:flex md:overflow-x-auto">
      {tabs.map(([id, label]) => (
        <button key={id} className={`min-h-11 rounded-md px-3 text-sm font-bold transition md:min-w-36 md:flex-1 ${activeView === id ? "bg-white text-ink" : "text-white/62 hover:bg-white/10 hover:text-white"}`} onClick={() => navigate(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}

function MarketplaceHighlights({ popularServices, sellers, testimonials, activeAds }) {
  return (
    <div className="space-y-6">
      <PlatformAdvantages />
      <PromoBanner ad={activeAds[0]} />
      <section className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
        <PopularServices services={popularServices} />
        <NewSellers sellers={sellers} />
      </section>
      <Testimonials testimonials={testimonials} />
    </div>
  );
}

function SectionHeader({ eyebrow, title, text }) {
  return <div><p className="text-sm font-black uppercase tracking-[0.18em] text-electric">{eyebrow}</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">{title}</h2>{text && <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">{text}</p>}</div>;
}

function PlatformAdvantages() {
  const items = [
    ["Проверенные продавцы", "Модерация услуг перед публикацией.", ShieldCheck],
    ["Backend-ready UI", "Все данные идут через API abstraction layer.", Zap],
    ["Готово к Supabase", "Mock API можно заменить реальными запросами.", WalletCards]
  ];
  return <section className="grid gap-4 md:grid-cols-3">{items.map(([title, text, Icon]) => <motion.article key={title} whileHover={{ y: -4 }} className="rounded-lg border border-line bg-white/8 p-5 shadow-card backdrop-blur"><span className="grid size-11 place-items-center rounded-lg bg-gradient-to-br from-violet via-electric to-rose"><Icon className="size-5" /></span><h3 className="mt-5 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-white/56">{text}</p></motion.article>)}</section>;
}

function PromoBanner({ ad }) {
  return (
    <section className="grid gap-5 overflow-hidden rounded-lg border border-line bg-[linear-gradient(135deg,rgba(139,92,246,0.22),rgba(56,189,248,0.14),rgba(244,114,182,0.18))] p-5 shadow-card backdrop-blur md:grid-cols-[1fr_auto] md:items-center">
      <div><div className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-black/18 px-3 py-1 text-xs font-bold text-white/68"><Megaphone className="size-4 text-rose" />Рекламное размещение</div><h2 className="mt-4 text-2xl font-black">{ad?.title ?? "Баннер на главной странице"}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">{ad?.copy ?? "Покажите услугу или продавца в самом заметном блоке маркетплейса."}</p></div>
      <div className="rounded-lg border border-line bg-black/20 p-4 text-left md:min-w-56"><p className="text-sm text-white/50">Стоимость</p><p className="mt-1 text-3xl font-black">2500 ₽</p><p className="mt-1 text-xs text-white/48">48 часов ротации</p></div>
    </section>
  );
}

function PopularServices({ services }) {
  return <section className="rounded-lg border border-line bg-white/7 p-5 shadow-card backdrop-blur"><SectionHeader eyebrow="Тренды" title="Популярные услуги" text="Предложения с высоким рейтингом и количеством заказов." /><div className="mt-5 grid gap-3">{services.map((service, index) => <div key={service.id} className="grid gap-3 rounded-lg border border-line bg-black/18 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="grid size-10 place-items-center rounded-lg bg-white text-sm font-black text-ink">{index + 1}</span><div className="min-w-0"><h3 className="truncate font-black">{service.title}</h3><p className="mt-1 text-xs text-white/48">{service.orders} заказов • {service.delivery}</p></div><span className="text-lg font-black">{money(service.price)}</span></div>)}</div></section>;
}

function NewSellers({ sellers }) {
  return <section className="rounded-lg border border-line bg-white/7 p-5 shadow-card backdrop-blur"><SectionHeader eyebrow="Продавцы" title="Новые продавцы" text="Профили, которые уже выглядят как полноценная витрина." /><div className="mt-5 space-y-3">{sellers.map((seller) => <div key={seller.id} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-black/18 p-4"><div className="flex min-w-0 items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet via-electric to-rose text-sm font-black">{seller.name.slice(0, 2).toUpperCase()}</span><div className="min-w-0"><div className="flex items-center gap-2"><h3 className="truncate font-black">{seller.name}</h3>{seller.verified && <BadgeCheck className="size-4 shrink-0 text-electric" />}</div><p className="mt-1 truncate text-xs text-white/48">{seller.role}</p></div></div><div className="text-right text-xs text-white/52"><p className="font-bold text-white">{seller.rating}</p><p>{seller.orders} заказов</p></div></div>)}</div></section>;
}

function Testimonials({ testimonials }) {
  return <section><SectionHeader eyebrow="Доверие" title="Отзывы клиентов" text="Социальное доказательство для презентации marketplace MVP." /><div className="mt-5 grid gap-4 md:grid-cols-3">{testimonials.map((item) => <motion.article key={item.id} whileHover={{ y: -4 }} className="rounded-lg border border-line bg-white/8 p-5 shadow-card backdrop-blur"><div className="flex gap-1 text-rose">{Array.from({ length: item.rating }).map((_, index) => <Star key={index} className="size-4 fill-current" />)}</div><p className="mt-4 text-sm leading-6 text-white/62">«{item.text}»</p><p className="mt-5 font-black">{item.name}</p></motion.article>)}</div></section>;
}

function CategoryRail({ selectedCategory, setSelectedCategory }) {
  return <div id="services" className="flex gap-2 overflow-x-auto pb-1">{["Все", ...categories].map((category) => <button key={category} onClick={() => setSelectedCategory(category)} className={`whitespace-nowrap rounded-lg border px-4 py-3 text-sm font-bold transition ${selectedCategory === category ? "border-white bg-white text-ink" : "border-line bg-white/6 text-white/66 hover:bg-white/12"}`}>{category}</button>)}</div>;
}

function ServiceGrid({ services, onOpenService }) {
  return <div className="grid gap-4 md:grid-cols-2">{services.map((service) => <ServiceCard key={service.id} service={service} onOpenService={onOpenService} />)}</div>;
}

function ServiceCard({ service, onOpenService }) {
  return (
    <motion.article whileHover={{ y: -5 }} className="group overflow-hidden rounded-lg border border-line bg-white/8 shadow-card backdrop-blur transition hover:border-white/24 hover:bg-white/10">
      <div className="h-2 bg-gradient-to-r from-violet via-electric to-rose" />
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><span className="rounded-full bg-violet/18 px-3 py-1 text-xs font-bold text-violet">{service.category}</span><span className="text-xl font-black">{money(service.price)}</span></div>
        <div className="mt-4 flex flex-wrap gap-2">{service.badges.map((badge) => <Badge key={badge} label={badge} />)}</div>
        <h3 className="mt-4 text-xl font-black">{service.title}</h3>
        <p className="mt-2 min-h-16 text-sm leading-6 text-white/62">{service.description}</p>
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-lg border border-line bg-black/18 p-3 text-center">
          <MiniStat icon={<Star className="size-4 fill-rose text-rose" />} value={service.ownerRating} label="рейтинг" />
          <MiniStat icon={<ShoppingBag className="size-4 text-electric" />} value={service.orders} label="заказов" />
          <MiniStat icon={<Clock3 className="size-4 text-violet" />} value={service.delivery} label="срок" />
        </div>
        <div className="mt-5 flex flex-col gap-4 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2 text-sm font-bold">{service.ownerName}<BadgeCheck className="size-4 text-electric" /></div><p className="mt-1 text-xs text-white/48">{service.reviews.length} отзывов</p></div><button className="rounded-lg bg-gradient-to-r from-violet via-electric to-rose px-4 py-2 text-sm font-black text-white transition group-hover:scale-[1.03]" onClick={() => onOpenService(service.id)}>Подробнее</button></div>
      </div>
    </motion.article>
  );
}

function ServiceDetail({ service, relatedServices, onBack, onOpenService, session, navigate }) {
  const packageItems = ["Проверка задачи и бриф перед стартом", "Выполнение услуги по заявленным условиям", "Отчет о результате и рекомендации по следующему шагу"];
  return (
    <div className="space-y-6">
      <button className="inline-flex items-center gap-2 rounded-lg border border-line bg-white/7 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/12" onClick={onBack}><ArrowLeft className="size-4" />Назад в маркетплейс</button>
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="overflow-hidden rounded-lg border border-line bg-white/8 shadow-card backdrop-blur"><div className="h-2 bg-gradient-to-r from-violet via-electric to-rose" /><div className="p-5 sm:p-7"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-violet/18 px-3 py-1 text-xs font-bold text-violet">{service.category}</span>{service.badges.map((badge) => <Badge key={badge} label={badge} />)}</div><h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">{service.title}</h1><p className="mt-4 max-w-3xl text-sm leading-7 text-white/62 sm:text-base">{service.description}</p><div className="mt-6 grid gap-3 sm:grid-cols-3"><DetailMetric icon={<Star className="size-5 fill-rose text-rose" />} value={service.ownerRating} label="рейтинг продавца" /><DetailMetric icon={<ShoppingBag className="size-5 text-electric" />} value={service.orders} label="заказов выполнено" /><DetailMetric icon={<Clock3 className="size-5 text-violet" />} value={service.delivery} label="срок выполнения" /></div><div className="mt-7 rounded-lg border border-line bg-black/20 p-5"><h2 className="text-xl font-black">Что входит в услугу</h2><div className="mt-4 grid gap-3">{packageItems.map((item) => <div key={item} className="flex gap-3 rounded-lg border border-line bg-white/5 p-3 text-sm text-white/66"><PackageCheck className="mt-0.5 size-4 shrink-0 text-electric" /><span>{item}</span></div>)}</div></div><div className="mt-7 rounded-lg border border-line bg-black/20 p-5"><h2 className="text-xl font-black">Отзывы</h2>{service.reviews.length > 0 ? <div className="mt-4 grid gap-3">{service.reviews.map((review, index) => <blockquote key={`${service.id}-${index}`} className="rounded-lg border border-line bg-white/5 p-4"><div className="flex gap-1 text-rose">{Array.from({ length: review.rating }).map((_, starIndex) => <Star key={starIndex} className="size-4 fill-current" />)}</div><p className="mt-3 text-sm leading-6 text-white/62">«{review.text}»</p></blockquote>)}</div> : <p className="mt-3 text-sm text-white/48">Отзывов пока нет. Эта услуга ожидает первых заказов.</p>}</div></div></article>
        <aside className="space-y-4 lg:sticky lg:top-28 lg:h-fit"><div className="rounded-lg border border-line bg-white/8 p-5 shadow-card backdrop-blur"><p className="text-sm text-white/50">Стоимость услуги</p><p className="mt-1 text-4xl font-black">{money(service.price)}</p><div className="mt-5 grid gap-3"><button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-ink transition hover:scale-[1.02]" onClick={() => !session && navigate("login")}>{session ? "Купить услугу" : "Войти для покупки"} <ChevronRight className="size-4" /></button><a className="inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white/8 px-4 py-3 text-sm font-black text-white transition hover:bg-white/14" href={SUPPORT_URL} target="_blank" rel="noreferrer">Написать в поддержку <LifeBuoy className="size-4" /></a></div></div><div className="rounded-lg border border-line bg-white/8 p-5 shadow-card backdrop-blur"><h2 className="text-lg font-black">Продавец</h2><div className="mt-4 flex items-center gap-3"><span className="grid size-12 place-items-center rounded-lg bg-gradient-to-br from-violet via-electric to-rose text-sm font-black">{service.ownerName.slice(0, 2).toUpperCase()}</span><div><div className="flex items-center gap-2 font-black">{service.ownerName}<BadgeCheck className="size-4 text-electric" /></div><p className="mt-1 text-xs text-white/48">Проверенный продавец • {service.orders} заказов</p></div></div></div><div className="rounded-lg border border-line bg-white/8 p-5 shadow-card backdrop-blur"><h2 className="text-lg font-black">Похожие услуги</h2><div className="mt-4 space-y-3">{relatedServices.map((item) => <button key={item.id} className="w-full rounded-lg border border-line bg-black/18 p-3 text-left transition hover:bg-white/10" onClick={() => onOpenService(item.id)}><span className="block truncate text-sm font-black">{item.title}</span><span className="mt-1 block text-xs text-white/48">{money(item.price)} • {item.orders} заказов</span></button>)}</div></div></aside>
      </section>
    </div>
  );
}

function DetailMetric({ icon, value, label }) {
  return <div className="rounded-lg border border-line bg-black/20 p-4"><div className="flex items-center gap-2 text-2xl font-black">{icon}{value}</div><p className="mt-1 text-xs text-white/48">{label}</p></div>;
}

function Badge({ label }) {
  const Icon = label === "Топ" ? Trophy : label === "Новое" ? TrendingUp : BadgeCheck;
  return <span className="inline-flex items-center gap-1 rounded-full border border-line bg-white/7 px-2.5 py-1 text-xs font-bold text-white/68"><Icon className="size-3.5 text-electric" />{label}</span>;
}

function MiniStat({ icon, value, label }) {
  return <div className="min-w-0"><div className="flex items-center justify-center gap-1 text-sm font-black">{icon}<span className="truncate">{value}</span></div><p className="mt-1 text-[11px] text-white/42">{label}</p></div>;
}

function CreateServicePanel({ draft, setDraft, createService, canSell, navigate }) {
  return (
    <aside className="h-fit rounded-lg border border-line bg-white/8 p-5 shadow-card backdrop-blur-xl xl:sticky xl:top-28">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-black">Создать услугу</h2><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/62">250 ₽</span></div>
      {!canSell && <div className="mb-4 rounded-lg border border-line bg-black/20 p-3 text-sm text-white/62"><Lock className="mb-2 size-4 text-electric" />Создавать услуги могут продавцы и администраторы. Войдите как `seller@pulse.local` или зарегистрируйтесь как продавец.</div>}
      <form className="space-y-4" onSubmit={createService}>
        <Field label="Название"><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Продвижение YouTube Shorts" /></Field>
        <Field label="Категория"><select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></Field>
        <Field label="Цена"><input type="number" min="100" value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} /></Field>
        <Field label="Описание"><textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Что получает покупатель, сроки, гарантии" rows={4} /></Field>
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-ink transition hover:scale-[1.02]">{canSell ? <Plus className="size-4" /> : <LogIn className="size-4" />}{canSell ? "Отправить на модерацию" : "Войти как продавец"}</button>
      </form>
      {!canSell && <button className="mt-3 w-full rounded-lg border border-line bg-white/6 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/12" onClick={() => navigate("register")}>Зарегистрироваться продавцом</button>}
    </aside>
  );
}

function Field({ label, children }) {
  return <label className="block text-sm font-bold text-white/66"><span className="mb-2 block">{label}</span>{children}</label>;
}

function Feed({ posts, deletePost, canManage }) {
  return (
    <div className="space-y-4">
      <SectionHeader eyebrow="Лента" title="Платные объявления" text="Социальная лента marketplace для быстрых предложений и обновлений продавцов." />
      {posts.map((post) => <article key={post.id} className="rounded-lg border border-line bg-white/8 p-5 shadow-card backdrop-blur"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-black">{post.author}</h3><p className="text-xs text-white/42">{post.createdAt}</p></div><span className="rounded-full bg-rose/16 px-3 py-1 text-xs font-black text-rose">{money(post.price)}</span></div><p className="mt-4 text-sm leading-7 text-white/70">{post.content}</p><div className="mt-5 flex items-center justify-between border-t border-line pt-4"><button className="inline-flex items-center gap-2 rounded-lg border border-line bg-white/8 px-4 py-2 text-sm font-bold hover:bg-white/14"><Megaphone className="size-4" />Продвигать</button>{canManage && <button className="grid size-9 place-items-center rounded-lg border border-line bg-white/6 hover:bg-rose/16" title="Удалить пост" onClick={() => deletePost(post.id)}><Trash2 className="size-4" /></button>}</div></article>)}
    </div>
  );
}

function SidePanel({ publishPost, canSell }) {
  return <aside className="h-fit rounded-lg border border-line bg-white/8 p-5 shadow-card backdrop-blur"><h2 className="text-xl font-black">Платные посты</h2><p className="mt-2 text-sm leading-6 text-white/58">Пользователи публикуют объявления для обновлений, предложений и быстрого поиска покупателей.</p><button onClick={publishPost} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-ink"><Plus className="size-4" />{canSell ? "Опубликовать демо-пост" : "Войти для публикации"}</button></aside>;
}

function AdminPanel({ services, posts, ads, approveService, rejectService, deletePost, toggleAd }) {
  return <div className="grid gap-5 lg:grid-cols-3"><AdminColumn title="Модерация услуг">{services.map((service) => <AdminItem key={service.id} title={service.title} meta={`${service.category} • ${statusLabels[service.status] ?? service.status}`}><button onClick={() => approveService(service.id)} className="admin-action bg-emerald-400/18 text-emerald-300" title="Одобрить"><Check className="size-4" /></button><button onClick={() => rejectService(service.id)} className="admin-action bg-rose/18 text-rose" title="Отклонить"><X className="size-4" /></button></AdminItem>)}</AdminColumn><AdminColumn title="Посты в ленте">{posts.map((post) => <AdminItem key={post.id} title={post.author} meta={post.content}><button onClick={() => deletePost(post.id)} className="admin-action bg-rose/18 text-rose" title="Удалить"><Trash2 className="size-4" /></button></AdminItem>)}</AdminColumn><AdminColumn title="Рекламные баннеры">{ads.map((ad) => <AdminItem key={ad.id} title={ad.title} meta={ad.active ? "Активная ротация" : "Остановлено"}><button onClick={() => toggleAd(ad.id)} className="admin-action bg-electric/18 text-electric" title={ad.active ? "Остановить" : "Включить"}>{ad.active ? <X className="size-4" /> : <Check className="size-4" />}</button></AdminItem>)}</AdminColumn></div>;
}

function AuthScreen({ mode, setMode, login, register, intendedView }) {
  const [form, setForm] = useState({ name: "", email: "seller@pulse.local", role: "seller" });
  const isRegister = mode === "register";

  function submit(event) {
    event.preventDefault();
    if (isRegister) {
      register(form);
    } else {
      login(form);
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-lg border border-line bg-white/8 p-6 shadow-card backdrop-blur">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-electric">Auth foundation</p>
        <h1 className="mt-3 text-3xl font-black sm:text-5xl">{isRegister ? "Регистрация" : "Вход в аккаунт"}</h1>
        <p className="mt-4 text-sm leading-7 text-white/62">
          Это mock-auth слой для MVP. Позже его можно заменить Supabase Auth или backend JWT без переписывания интерфейса.
        </p>
        <div className="mt-5 rounded-lg border border-line bg-black/20 p-4 text-sm text-white/60">
          <p className="font-bold text-white">Быстрые роли для проверки:</p>
          <p className="mt-2">admin@pulse.local → admin</p>
          <p>seller@pulse.local → seller</p>
          <p>любой другой email → user</p>
          <p className="mt-2">Защищенный раздел: {intendedView}</p>
        </div>
      </div>

      <form className="rounded-lg border border-line bg-white/8 p-6 shadow-card backdrop-blur" onSubmit={submit}>
        {isRegister && <Field label="Имя"><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ваше имя" /></Field>}
        <div className={isRegister ? "mt-4" : ""}>
          <Field label="Email"><input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="seller@pulse.local" /></Field>
        </div>
        {isRegister && <div className="mt-4"><Field label="Роль"><select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="user">Пользователь</option><option value="seller">Продавец</option></select></Field></div>}
        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-ink transition hover:scale-[1.02]">
          {isRegister ? <UserPlus className="size-4" /> : <LogIn className="size-4" />}
          {isRegister ? "Создать аккаунт" : "Войти"}
        </button>
        <button type="button" className="mt-3 w-full rounded-lg border border-line bg-white/6 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/12" onClick={() => setMode(isRegister ? "login" : "register")}>
          {isRegister ? "Уже есть аккаунт" : "Создать аккаунт"}
        </button>
      </form>
    </section>
  );
}

function Contacts() {
  return <section id="contacts" className="grid gap-5 lg:grid-cols-[1fr_1fr]"><div className="rounded-lg border border-line bg-white/8 p-6 shadow-card backdrop-blur"><p className="text-sm font-bold text-electric">Контакты</p><h2 className="mt-3 text-3xl font-black">Связь с поддержкой и сообществом</h2><p className="mt-4 text-sm leading-7 text-white/62">Если нужно уточнить правила размещения, модерацию, рекламу или работу маркетплейса, напишите в Telegram-поддержку. Для новостей и общения переходите в сообщество.</p></div><div className="grid gap-4 sm:grid-cols-2"><ContactCard title="Поддержка" text="@Seagullstol" href={SUPPORT_URL} icon={<LifeBuoy className="size-5" />} /><ContactCard title="Сообщество" text="t.me/rulegek" href={COMMUNITY_URL} icon={<MessageCircle className="size-5" />} /></div></section>;
}

function ContactCard({ title, text, href, icon }) {
  return <a className="flex min-h-48 flex-col justify-between rounded-lg border border-line bg-white/8 p-5 shadow-card backdrop-blur transition hover:-translate-y-1 hover:bg-white/12" href={href} target="_blank" rel="noreferrer"><span className="grid size-11 place-items-center rounded-lg bg-gradient-to-br from-violet via-electric to-rose">{icon}</span><span><span className="block text-xl font-black">{title}</span><span className="mt-2 block text-sm text-white/58">{text}</span></span></a>;
}

function Footer({ navigate }) {
  return <footer className="grid gap-5 rounded-lg border border-line bg-white/6 p-5 text-sm text-white/58 backdrop-blur md:grid-cols-[1fr_auto] md:items-center"><div><p className="font-black text-white">PulseMarket</p><p className="mt-1">Маркетплейс digital-услуг, объявлений и рекламных размещений.</p></div><div className="grid gap-2 sm:flex"><button className="rounded-lg border border-line bg-white/5 px-4 py-2 font-bold text-white transition hover:bg-white/12" onClick={() => navigate("contacts")}>Контакты</button><a className="rounded-lg border border-line bg-white/5 px-4 py-2 font-bold text-white transition hover:bg-white/12" href={SUPPORT_URL} target="_blank" rel="noreferrer">Поддержка</a><a className="rounded-lg border border-line bg-white/5 px-4 py-2 font-bold text-white transition hover:bg-white/12" href={COMMUNITY_URL} target="_blank" rel="noreferrer">Сообщество</a></div></footer>;
}

function MobileBottomNav({ activeView, navigate, pendingCount }) {
  const items = [["market", "Главная", Home], ["feed", "Лента", Store], ["admin", "Админ", LayoutDashboard], ["contacts", "Контакты", LifeBuoy]];
  return <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 gap-1 rounded-lg border border-line bg-ink/88 p-1 shadow-glow backdrop-blur-xl lg:hidden">{items.map(([id, label, Icon]) => <button key={id} className={`relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-bold transition ${activeView === id ? "bg-white text-ink" : "text-white/58"}`} onClick={() => navigate(id)}><Icon className="size-4" />{label}{id === "admin" && pendingCount > 0 && <CounterBadge count={pendingCount} />}</button>)}</nav>;
}

function AdminColumn({ title, children }) {
  return <section className="rounded-lg border border-line bg-white/8 p-5 shadow-card backdrop-blur"><h2 className="mb-4 text-xl font-black">{title}</h2><div className="space-y-3">{children}</div></section>;
}

function AdminItem({ title, meta, children }) {
  return <div className="rounded-lg border border-line bg-black/20 p-4"><h3 className="font-bold">{title}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-white/48">{meta}</p><div className="mt-3 flex gap-2">{children}</div></div>;
}

createRoot(document.getElementById("root")).render(<App />);
