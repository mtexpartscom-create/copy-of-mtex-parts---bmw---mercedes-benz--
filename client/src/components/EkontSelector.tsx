/**
 * Ekont City and Office Selector
 * Dynamic selection of delivery location
 */

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EkontSelectorProps {
  onCityChange?: (cityId: string, cityName: string) => void;
  onOfficeChange?: (officeId: string, officeName: string) => void;
  onShippingCostChange?: (cost: number) => void;
}

export default function EkontSelector({
  onCityChange,
  onOfficeChange,
  onShippingCostChange,
}: EkontSelectorProps) {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedOffice, setSelectedOffice] = useState<string>("");

  // Fetch cities
  const citiesQuery = trpc.ecommerce.ekont.getCities.useQuery();

  // Fetch offices for selected city
  const officesQuery = trpc.ecommerce.ekont.getOffices.useQuery(selectedCity, {
    enabled: !!selectedCity,
  });

  // Calculate shipping cost
  const shippingQuery = trpc.ecommerce.ekont.calculateShipping.useQuery(
    { cityId: selectedCity, weight: 1 },
    { enabled: !!selectedCity }
  );

  // Handle city change
  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId);
    setSelectedOffice(""); // Reset office selection

    const city = citiesQuery.data?.find((c) => c.id === cityId);
    if (city) {
      onCityChange?.(cityId, city.name);
    }
  };

  // Handle office change
  const handleOfficeChange = (officeId: string) => {
    setSelectedOffice(officeId);

    const office = officesQuery.data?.find((o) => o.id === officeId);
    if (office) {
      onOfficeChange?.(officeId, office.name);
    }
  };

  // Update shipping cost
  useEffect(() => {
    if (shippingQuery.data?.cost) {
      onShippingCostChange?.(shippingQuery.data.cost);
    }
  }, [shippingQuery.data?.cost, onShippingCostChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Доставка</CardTitle>
        <CardDescription>Изберете град и офис на Еконт</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* City Selection */}
        <div className="space-y-2">
          <Label htmlFor="city-select">Град *</Label>
          <Select value={selectedCity} onValueChange={handleCityChange}>
            <SelectTrigger id="city-select">
              <SelectValue placeholder="Изберете град..." />
            </SelectTrigger>
            <SelectContent>
              {citiesQuery.isLoading ? (
                <div className="p-2 text-sm text-muted-foreground">Зареждане...</div>
              ) : citiesQuery.error ? (
                <div className="p-2 text-sm text-destructive">Грешка при зареждане</div>
              ) : citiesQuery.data && citiesQuery.data.length > 0 ? (
                citiesQuery.data.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-muted-foreground">Няма налични градове</div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Office Selection */}
        {selectedCity && (
          <div className="space-y-2">
            <Label htmlFor="office-select">Офис на Еконт *</Label>
            <Select value={selectedOffice} onValueChange={handleOfficeChange}>
              <SelectTrigger id="office-select">
                <SelectValue placeholder="Изберете офис..." />
              </SelectTrigger>
            <SelectContent>
              {officesQuery.isLoading ? (
                <div className="p-2 text-sm text-muted-foreground">Зареждане...</div>
              ) : officesQuery.error ? (
                <div className="p-2 text-sm text-destructive">Грешка при зареждане</div>
              ) : officesQuery.data && officesQuery.data.length > 0 ? (
                officesQuery.data.map((office) => (
                  <SelectItem key={office.id} value={office.id}>
                    <div className="flex flex-col">
                      <span>{office.name}</span>
                      <span className="text-xs text-muted-foreground">{office.address}</span>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-muted-foreground">
                  Няма налични офиси
                </div>
              )}
            </SelectContent>
            </Select>
          </div>
        )}

        {/* Shipping Cost */}
        {selectedCity && shippingQuery.data && (
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Цена на доставка:</span>
              <span className="font-semibold">{shippingQuery.data.cost.toFixed(2)} лв.</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Доставка до избрания офис на Еконт
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
