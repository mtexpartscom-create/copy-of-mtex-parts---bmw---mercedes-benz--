# Performance Optimization Plan

## Phase 23: Performance Optimization

### 1. Lazy Loading for Images
- Implement React lazy loading for vehicle images
- Add Intersection Observer API for image loading
- Add loading placeholders (blur-up effect)
- Optimize image sizes (WebP format, responsive srcset)

**Files to update:**
- `client/src/components/VehicleGallery.tsx`
- `client/src/components/ImageViewerModal.tsx`
- `client/src/pages/ProductCatalog.tsx`
- `client/src/pages/PartsShop.tsx`

### 2. Database Indexes
- Add indexes for frequently queried fields:
  - `users.email` (authentication)
  - `vehicles.vin` (search)
  - `vehicles.brand` (filtering)
  - `vehicles.model` (filtering)
  - `orders.customerId` (customer orders)
  - `listings.brand` (search/filter)

**Files to update:**
- `drizzle/schema.ts` (add .index() calls)

### 3. React Query Caching Strategies
- Implement stale-while-revalidate pattern
- Add cache invalidation on mutations
- Configure query retry policies
- Add background refetch strategies

**Files to update:**
- `client/src/lib/trpc.ts`
- `client/src/main.tsx`

### 4. Code Splitting for Routes
- Implement React.lazy() for route components
- Add Suspense boundaries with loading states
- Split admin dashboard into lazy-loaded tabs
- Split service pages into lazy components

**Files to update:**
- `client/src/App.tsx`
- `client/src/pages/AdminDashboard.tsx`

### 5. Performance Metrics
- Measure bundle size (current vs optimized)
- Measure initial load time
- Measure Time to Interactive (TTI)
- Measure Largest Contentful Paint (LCP)
- Profile React component renders

**Tools:**
- `npm run build` (bundle analysis)
- Chrome DevTools (performance profiling)
- Lighthouse (performance audit)

## Implementation Order
1. Lazy loading images (highest impact)
2. Database indexes (query performance)
3. Code splitting (bundle size)
4. React Query caching (user experience)
5. Performance metrics (monitoring)

## Expected Improvements
- Image load time: -60% (lazy loading)
- Query performance: -40% (database indexes)
- Initial bundle size: -30% (code splitting)
- Time to Interactive: -25% (combined optimizations)
