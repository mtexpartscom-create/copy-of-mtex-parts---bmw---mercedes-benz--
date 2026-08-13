import { Heart, HeartOff, ShoppingCart, Trash2, ArrowRight, PackageOpen } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import GlobalNavigation from "@/components/GlobalNavigation";
import { LazyImage } from "@/components/LazyImage";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCart, type CartItem } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";

export function toCartItem(favorite: {
  productId: number;
  name: string;
  price: string;
  compatibleBrands: string | null;
  compatibleModels: string | null;
  primaryImageUrl: string | null;
}): CartItem {
  const brand = favorite.compatibleBrands?.split(",")[0]?.trim() || "BMW / Mercedes-Benz";
  const model = favorite.compatibleModels?.split(",")[0]?.trim() || "OEM част";
  const price = Number.parseFloat(favorite.price.replace(",", "."));

  return {
    id: favorite.productId,
    name: favorite.name,
    brand,
    model,
    price: Number.isFinite(price) ? price : 0,
    quantity: 1,
    image: favorite.primaryImageUrl || undefined,
  };
}

export default function Favorites() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { addToCart, items: cartItems } = useCart();
  const isApprovedB2B = user?.userType === "b2b" && user?.b2bApprovalStatus === "approved";
  const favoritesQuery = trpc.ecommerce.favorites.getAll.useQuery(undefined, {
    enabled: isApprovedB2B,
    retry: false,
  });
  const removeFavorite = trpc.ecommerce.favorites.remove.useMutation({
    onSuccess: async () => {
      await favoritesQuery.refetch();
      toast.success("Продуктът е премахнат от Любими");
    },
    onError: (error) => toast.error(error.message || "Неуспешно премахване на продукта"),
  });

  const favorites = favoritesQuery.data ?? [];
  const availableFavorites = favorites.filter((favorite) => favorite.stock > 0 && favorite.status === "active");

  const addFavoriteToCart = (favorite: (typeof favorites)[number]) => {
    if (favorite.stock <= 0 || favorite.status !== "active") {
      toast.error("Този продукт в момента не е наличен");
      return;
    }
    addToCart(toCartItem(favorite));
    toast.success(`${favorite.name} е добавен в количката`);
  };

  const addAllToCart = () => {
    availableFavorites.forEach((favorite) => addToCart(toCartItem(favorite)));
    if (availableFavorites.length > 0) {
      toast.success(`${availableFavorites.length} продукта са добавени в количката`);
    }
    if (availableFavorites.length < favorites.length) {
      toast.info("Продуктите без наличност не са добавени");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0d0e10] text-white grid place-items-center">
        <p className="text-sm text-slate-400">Проверка на B2B достъпа...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isApprovedB2B) {
    return (
      <div className="min-h-screen bg-[#0d0e10] text-white">
        <GlobalNavigation />
        <Breadcrumb items={[{ label: "Начало", href: "/" }, { label: "Любими" }]} />
        <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 text-center">
          <Heart className="mx-auto mb-5 h-14 w-14 text-blue-500" />
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">Любими продукти за B2B клиенти</h1>
          <p className="mx-auto mb-8 max-w-xl text-slate-400">
            Запазвайте често поръчваните OEM части и ги добавяйте в количката с един клик. Функцията е достъпна за одобрени бизнес клиенти.
          </p>
          {!isAuthenticated ? (
            <Button onClick={() => setLocation("/parts-shop")} className="bg-blue-600 hover:bg-blue-700">
              Към магазина <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => setLocation("/")} variant="outline">
              Към началната страница
            </Button>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0e10] text-white">
      <GlobalNavigation />
      <Breadcrumb items={[{ label: "Начало", href: "/" }, { label: "Любими" }]} />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">
              <Heart className="h-3.5 w-3.5 fill-current" /> B2B бърза поръчка
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">Любими продукти</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Вашият списък с често поръчвани части. Одобрената B2B отстъпка от 15% се прилага автоматично при оформяне на поръчката.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={addAllToCart} disabled={availableFavorites.length === 0} className="bg-blue-600 hover:bg-blue-700">
              <ShoppingCart className="mr-2 h-4 w-4" /> Добави всички
            </Button>
            <Button onClick={() => setLocation("/cart")} variant="outline" disabled={cartItems.length === 0}>
              Количка ({cartItems.length})
            </Button>
          </div>
        </header>

        {favoritesQuery.isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="h-80 animate-pulse rounded-2xl bg-white/5" />)}
          </div>
        ) : favoritesQuery.isError ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
            <p className="text-red-200">Не успяхме да заредим Любими продукти.</p>
            <Button onClick={() => favoritesQuery.refetch()} variant="outline" className="mt-4">Опитай отново</Button>
          </div>
        ) : favorites.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-20 text-center">
            <PackageOpen className="mx-auto mb-5 h-14 w-14 text-slate-500" />
            <h2 className="text-2xl font-semibold">Все още нямате любими продукти</h2>
            <p className="mx-auto mt-3 max-w-lg text-slate-400">Добавете сърце към продуктите, които поръчвате най-често, за да ги намирате по-бързо.</p>
            <Button onClick={() => setLocation("/parts-shop")} className="mt-7 bg-blue-600 hover:bg-blue-700">Разгледай авточастите</Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((favorite) => (
              <article key={favorite.favoriteId} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-blue-500/50 hover:bg-white/[0.05]">
                <div className="relative h-52 bg-white/[0.03]">
                  {favorite.primaryImageUrl ? (
                    <LazyImage src={favorite.primaryImageUrl} alt={favorite.name} className="h-full w-full object-cover" width={480} height={320} />
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-slate-500">Няма изображение</div>
                  )}
                  <button
                    type="button"
                    aria-label={`Премахни ${favorite.name} от Любими`}
                    onClick={() => removeFavorite.mutate({ productId: favorite.productId })}
                    disabled={removeFavorite.isPending}
                    className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/60 p-2 text-red-300 transition hover:bg-red-500/20"
                  >
                    <HeartOff className="h-4 w-4" />
                  </button>
                  {(favorite.stock <= 0 || favorite.status !== "active") && <span className="absolute bottom-3 left-3 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold">Недостъпно</span>}
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h2 className="line-clamp-2 text-lg font-semibold">{favorite.name}</h2>
                    <span className="shrink-0 text-lg font-bold text-blue-300">{favorite.price} лв.</span>
                  </div>
                  <p className="mb-4 line-clamp-2 min-h-10 text-sm text-slate-400">{favorite.description || "OEM авточаст за BMW и Mercedes-Benz"}</p>
                  <div className="mb-4 flex flex-wrap gap-2 text-xs text-slate-400">
                    {favorite.compatibleBrands && <span className="rounded-full bg-white/5 px-2.5 py-1">{favorite.compatibleBrands}</span>}
                    {favorite.stock > 0 && favorite.status === "active" && <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-300">В наличност: {favorite.stock}</span>}
                  </div>
                  <Button onClick={() => addFavoriteToCart(favorite)} disabled={favorite.stock <= 0 || favorite.status !== "active"} className="w-full bg-blue-600 hover:bg-blue-700">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Добави в количката
                  </Button>
                  <Button onClick={() => removeFavorite.mutate({ productId: favorite.productId })} variant="ghost" className="mt-2 w-full text-slate-400 hover:text-red-300">
                    <Trash2 className="mr-2 h-4 w-4" /> Премахни от Любими
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
