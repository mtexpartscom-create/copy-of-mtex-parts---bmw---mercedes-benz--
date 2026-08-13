import React from "react";
import { Heart, MessageCircle, Phone, ShoppingCart, Zap } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";

interface HeaderQuickActionsProps {
  mobile?: boolean;
}

export default function HeaderQuickActions({ mobile = false }: HeaderQuickActionsProps) {
  const { user, isAuthenticated } = useAuth();
  const { items } = useCart();
  const isApprovedB2B = user?.userType === "b2b" && user?.b2bApprovalStatus === "approved";
  const favoritesQuery = trpc.ecommerce.favorites.getIds.useQuery(undefined, {
    enabled: isApprovedB2B,
    retry: false,
  });
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const favoritesCount = favoritesQuery.data?.length ?? 0;
  const fastOrderHref = isApprovedB2B ? "/favorites" : isAuthenticated ? "/parts-shop" : getLoginUrl();
  const fastOrderLabel = isApprovedB2B ? "Бърза поръчка" : isAuthenticated ? "Поръчай част" : "B2B вход";

  if (mobile) {
    return (
      <div className="header-quick-actions-mobile">
        <a
          href={fastOrderHref}
          className="header-fast-order-button"
          aria-label={`${fastOrderLabel} за BMW и Mercedes-Benz`}
        >
          <Zap className="h-4 w-4" />
          <span>{fastOrderLabel}</span>
        </a>
        <div className="header-contact-actions" aria-label="Бързи контакти">
          <a href="tel:+359898606626" aria-label="Обади се на MTEX PARTS" className="header-contact-action">
            <Phone className="h-4 w-4" />
            <span>Обади се</span>
          </a>
          <a
            href="https://wa.me/359898606626?text=Здравейте%2C%20интересувам%20се%20от%20BMW%20или%20Mercedes-Benz%20авточаст."
            target="_blank"
            rel="noreferrer"
            aria-label="Пиши в WhatsApp"
            className="header-contact-action"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </a>
        </div>
        <div className="header-cart-actions">
          {isApprovedB2B && (
            <a href="/favorites" className="header-icon-action" aria-label={`Любими продукти: ${favoritesCount}`}>
              <Heart className="h-4 w-4" />
              {favoritesCount > 0 && <span className="header-action-badge">{favoritesCount}</span>}
            </a>
          )}
          <a href="/cart" className="header-icon-action" aria-label={`Количка: ${cartCount} артикула`}>
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && <span className="header-action-badge">{cartCount}</span>}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="header-quick-actions" aria-label="Бързи действия">
      <a href="tel:+359898606626" className="header-contact-link" aria-label="Телефон на MTEX PARTS">
        <Phone className="h-3.5 w-3.5" />
        <span>+359 898 606 626</span>
      </a>
      <a
        href="https://wa.me/359898606626?text=Здравейте%2C%20интересувам%20се%20от%20BMW%20или%20Mercedes-Benz%20авточаст."
        target="_blank"
        rel="noreferrer"
        className="header-icon-action"
        aria-label="Пиши в WhatsApp"
        title="WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </a>
      {isApprovedB2B && (
        <a href="/favorites" className="header-icon-action" aria-label={`Любими продукти: ${favoritesCount}`} title="Любими продукти">
          <Heart className="h-4 w-4" />
          {favoritesCount > 0 && <span className="header-action-badge">{favoritesCount}</span>}
        </a>
      )}
      <a href="/cart" className="header-icon-action" aria-label={`Количка: ${cartCount} артикула`} title="Количка">
        <ShoppingCart className="h-4 w-4" />
        {cartCount > 0 && <span className="header-action-badge">{cartCount}</span>}
      </a>
      <a href={fastOrderHref} className="header-fast-order-button header-fast-order-button-desktop">
        <Zap className="h-3.5 w-3.5" />
        <span>{fastOrderLabel}</span>
      </a>
    </div>
  );
}
