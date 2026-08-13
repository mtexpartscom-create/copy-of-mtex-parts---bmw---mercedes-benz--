import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomeRestructured from "./pages/HomeRestructured";
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CustomerDetail = lazy(() => import("./pages/CustomerDetail"));
const VehicleDetail = lazy(() => import("./pages/VehicleDetail"));
const ProductCatalog = lazy(() => import("./pages/ProductCatalog"));
const AutoServiceDetail = lazy(() => import("./pages/AutoServiceDetail"));
const ACService = lazy(() => import("./pages/ACService"));
const RoadAssistance = lazy(() => import("./pages/RoadAssistance"));
const SellCar = lazy(() => import("./pages/SellCar"));
const PartsShop = lazy(() => import("./pages/PartsShop"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Favorites = lazy(() => import("./pages/Favorites"));

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground grid place-items-center">
          <span className="text-sm text-muted-foreground">Зареждане...</span>
        </div>
      }
    >
      <Switch>
      <Route path={"/"} component={HomeRestructured} />
      <Route path={"/catalog"} component={ProductCatalog} />
      <Route path={"/auto-service-detail"} component={AutoServiceDetail} />
      <Route path={"/ac-service"} component={ACService} />
      <Route path={"/road-assistance"} component={RoadAssistance} />
      <Route path={"/sell-car"} component={SellCar} />
      <Route path={"/parts-shop"} component={PartsShop} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/favorites"} component={Favorites} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/customer/:id"} component={CustomerDetail} />
      <Route path={"/vehicle/:id"} component={VehicleDetail} />
      <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
