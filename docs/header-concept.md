# MTEX PARTS Header Concept

## Design direction

The header is designed as a premium automotive control surface rather than a generic website bar. The visual language uses a charcoal background, BMW-inspired blue, restrained red accents, crisp white typography, and compact utility controls. The header stays visually quiet over the hero image and gains a translucent blurred surface as the page scrolls.

## Desktop information architecture

The left side carries the MTEX PARTS identity and the BMW & Mercedes-Benz specialization label. The central navigation establishes the primary discovery path: Начало, Услуги, За нас, and Контакти. The Услуги menu contains the six key business destinations: Автоморга, Авточасти, Автосервиз, Автоклиматици, Пътна помощ, and Продай автомобила си.

The right side is reserved for actions with commercial intent. It contains a phone shortcut, WhatsApp shortcut, an authenticated B2B Любими shortcut with a saved-item badge, a cart shortcut with quantity badge, and the primary Бърза поръчка CTA. Approved B2B customers go directly to Любими; signed-in non-B2B users are routed to the parts shop; logged-out visitors are directed to the existing OAuth login flow.

## Mobile information architecture

On mobile, the logo and hamburger control remain in the fixed top bar. Opening the menu reveals the blue fast-order CTA first, followed by Обади се and WhatsApp contact actions, then Любими and Количка shortcuts, and finally the main navigation and services submenu. This order prioritizes repeat ordering and human contact before secondary browsing actions.

## Interaction states

The design includes explicit hover, focus, pressed, and disabled states. Action badges display the number of saved favorites or cart units, while the B2B CTA label changes according to authentication state. All action links have accessible labels, the menu button preserves the existing 44px touch target, and phone/WhatsApp actions are available without opening a secondary page.

## Implementation map

| Area | Implementation |
| --- | --- |
| Global shell | `GlobalNavigation.tsx` |
| Quick actions | `HeaderQuickActions.tsx` |
| Favorites destination | `/favorites` |
| Cart destination | `/cart` |
| B2B CTA destination | `/favorites`, `/parts-shop`, or OAuth login depending on state |
| Responsive styling | `client/src/index.css` |
| Regression tests | `server/header-quick-actions.test.tsx` |

## Verification

The new header action component has rendered desktop and mobile tests covering B2B fast order, favorites count, cart count, phone, WhatsApp, and mobile stacking. The managed preview rendered the updated header with the WhatsApp, cart, and fast-order controls in the desktop hero state. The preview URL used for an independent Chromium screenshot expired during one attempt, so the managed preview screenshot and rendered tests remain the authoritative evidence for this iteration.
