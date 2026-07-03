import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDetail from "./pages/CustomerDetail";
import VehicleDetail from "./pages/VehicleDetail";
import ProductCatalog from "./pages/ProductCatalog";
import AutoServiceDetail from "./pages/AutoServiceDetail";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/catalog"} component={ProductCatalog} />
      <Route path={"/auto-service-detail"} component={AutoServiceDetail} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/customer/:id"} component={CustomerDetail} />
      <Route path={"/vehicle/:id"} component={VehicleDetail} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
          <SpeedInsights />
          <Analytics />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
