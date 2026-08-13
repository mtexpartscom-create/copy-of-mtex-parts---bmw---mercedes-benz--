import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

interface FavoriteButtonProps {
  productId: number;
  productName?: string;
  size?: "sm" | "default" | "lg" | "icon";
  className?: string;
}

export default function FavoriteButton({
  productId,
  productName = "продукта",
  size = "icon",
  className = "",
}: FavoriteButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const isApprovedB2B = user?.userType === "b2b" && user?.b2bApprovalStatus === "approved";
  const utils = trpc.useUtils();
  const favoriteIdsQuery = trpc.ecommerce.favorites.getIds.useQuery(undefined, {
    enabled: isApprovedB2B,
    retry: false,
  });
  const toggleFavorite = trpc.ecommerce.favorites.toggle.useMutation({
    onMutate: async ({ productId: toggledProductId }) => {
      await utils.ecommerce.favorites.getIds.cancel();
      const previousIds = utils.ecommerce.favorites.getIds.getData();
      utils.ecommerce.favorites.getIds.setData(undefined, (ids) => {
        const currentIds = ids ?? [];
        return currentIds.includes(toggledProductId)
          ? currentIds.filter((id) => id !== toggledProductId)
          : [...currentIds, toggledProductId];
      });
      return { previousIds };
    },
    onError: (error, _input, context) => {
      utils.ecommerce.favorites.getIds.setData(undefined, context?.previousIds);
      toast.error(error.message || "Неуспешно обновяване на Любими");
    },
    onSuccess: (result) => {
      void utils.ecommerce.favorites.getAll.invalidate();
      toast.success(result.isFavorite ? `${productName} е добавен в Любими` : `${productName} е премахнат от Любими`);
    },
  });

  const isFavorite = favoriteIdsQuery.data?.includes(productId) ?? false;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      toast.info("Влезте в профила си като одобрен B2B клиент, за да използвате Любими.");
      return;
    }
    if (!isApprovedB2B) {
      toast.info("Любими продукти са достъпни за одобрени B2B клиенти.");
      return;
    }
    toggleFavorite.mutate({ productId });
  };

  return (
    <Button
      type="button"
      size={size}
      variant="outline"
      aria-label={isFavorite ? `Премахни ${productName} от Любими` : `Добави ${productName} в Любими`}
      aria-pressed={isFavorite}
      title={isFavorite ? "Премахни от Любими" : "Добави в Любими"}
      onClick={handleClick}
      disabled={toggleFavorite.isPending}
      className={`border-blue-500/30 bg-blue-500/5 text-blue-300 hover:bg-blue-500/15 ${className}`}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
      {size !== "icon" && <span className="ml-2">{isFavorite ? "В Любими" : "Любими"}</span>}
    </Button>
  );
}
