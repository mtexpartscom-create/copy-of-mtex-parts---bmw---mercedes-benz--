/**
 * Vehicle Detail Page
 * Shows vehicle information with associated customer, service history, and inquiries
 */

import { useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Car, User, Wrench, FileText } from "lucide-react";
import { useLocation } from "wouter";

export default function VehicleDetail() {
  const [, params] = useRoute("/vehicle/:id");
  const [, navigate] = useLocation();
  const vehicleId = params?.id ? parseInt(params.id) : null;

  const vehicleQuery = trpc.crm.vehicles.getById.useQuery(vehicleId || 0, {
    enabled: !!vehicleId,
  });

  const serviceHistoryQuery = trpc.crm.serviceHistory.getByVehicleId.useQuery(vehicleId || 0, {
    enabled: !!vehicleId,
  });

  if (!vehicleId) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Vehicle not found</p>
        </div>
      </DashboardLayout>
    );
  }

  if (vehicleQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  const vehicle = vehicleQuery.data;

  if (!vehicle) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Vehicle not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-muted-foreground">VIN: {vehicle.vin}</p>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Make</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{vehicle.make}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Model</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{vehicle.model}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Year</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{vehicle.year || "N/A"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engine</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{vehicle.engine || "N/A"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="service" className="w-full">
          <TabsList>
            <TabsTrigger value="service">Service History ({serviceHistoryQuery.data?.length || 0})</TabsTrigger>
          </TabsList>

          {/* Service History Tab */}
          <TabsContent value="service" className="space-y-4">
            {serviceHistoryQuery.data && serviceHistoryQuery.data.length > 0 ? (
              <div className="grid gap-4">
                {serviceHistoryQuery.data.map((history: any) => (
                  <Card key={history.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5" />
                        {history.serviceType}
                      </CardTitle>
                      <CardDescription>
                        {history.serviceDate ? new Date(history.serviceDate).toLocaleDateString() : "No date"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {history.partsUsed && <p className="text-sm">Parts Used: {history.partsUsed}</p>}
                        {history.notes && <p className="text-sm">{history.notes}</p>}
                        {history.cost && <p className="text-sm font-semibold">Cost: {history.cost}</p>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No service history</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
