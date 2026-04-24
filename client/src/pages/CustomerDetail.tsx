/**
 * Customer Detail Page
 * Shows full customer profile with vehicles, service history, inquiries, and bookings
 */

import { useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, Car, FileText, Calendar, Wrench } from "lucide-react";
import { useLocation } from "wouter";

export default function CustomerDetail() {
  const [, params] = useRoute("/customer/:id");
  const [, navigate] = useLocation();
  const customerId = params?.id ? parseInt(params.id) : null;

  const customerQuery = trpc.crm.customers.getById.useQuery(customerId || 0, {
    enabled: !!customerId,
  });

  const vehiclesQuery = trpc.crm.vehicles.getByCustomerId.useQuery(customerId || 0, {
    enabled: !!customerId,
  });

  const inquiriesQuery = trpc.crm.inquiries.getByCustomerId.useQuery(customerId || 0, {
    enabled: !!customerId,
  });

  const bookingsQuery = trpc.crm.bookings.getByCustomerId.useQuery(customerId || 0, {
    enabled: !!customerId,
  });

  const serviceHistoryQuery = trpc.crm.serviceHistory.getByCustomerId.useQuery(customerId || 0, {
    enabled: !!customerId,
  });

  if (!customerId) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Customer not found</p>
        </div>
      </DashboardLayout>
    );
  }

  if (customerQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  const customer = customerQuery.data;

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Customer not found</p>
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
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <p className="text-muted-foreground">Customer Profile</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Phone</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{customer.phone || "N/A"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold break-all">{customer.email || "N/A"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicles</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{vehiclesQuery.data?.length || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="vehicles" className="w-full">
          <TabsList>
            <TabsTrigger value="vehicles">Vehicles ({vehiclesQuery.data?.length || 0})</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries ({inquiriesQuery.data?.length || 0})</TabsTrigger>
            <TabsTrigger value="bookings">Bookings ({bookingsQuery.data?.length || 0})</TabsTrigger>
            <TabsTrigger value="service">Service History ({serviceHistoryQuery.data?.length || 0})</TabsTrigger>
          </TabsList>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-4">
            {vehiclesQuery.data && vehiclesQuery.data.length > 0 ? (
              <div className="grid gap-4">
                {vehiclesQuery.data.map((vehicle) => (
                  <Card key={vehicle.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        {vehicle.make} {vehicle.model}
                      </CardTitle>
                      <CardDescription>VIN: {vehicle.vin}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Year</p>
                          <p className="font-semibold">{vehicle.year || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Engine</p>
                          <p className="font-semibold">{vehicle.engine || "N/A"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No vehicles registered</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-4">
            {inquiriesQuery.data && inquiriesQuery.data.length > 0 ? (
              <div className="grid gap-4">
                {inquiriesQuery.data.map((inquiry) => (
                  <Card key={inquiry.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {inquiry.partName}
                      </CardTitle>
                      <CardDescription>Status: {inquiry.status}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">{inquiry.notes}</p>
                        {inquiry.quotedPrice && (
                          <p className="text-sm font-semibold">Quoted Price: {inquiry.quotedPrice}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No inquiries</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            {bookingsQuery.data && bookingsQuery.data.length > 0 ? (
              <div className="grid gap-4">
                {bookingsQuery.data.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {booking.serviceType}
                      </CardTitle>
                      <CardDescription>Status: {booking.status}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                        {booking.notes && <p className="text-sm">{booking.notes}</p>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No bookings</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Service History Tab */}
          <TabsContent value="service" className="space-y-4">
            {serviceHistoryQuery.data && serviceHistoryQuery.data.length > 0 ? (
              <div className="grid gap-4">
                {serviceHistoryQuery.data.map((history) => (
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
                        {history.partsUsed && <p className="text-sm">Parts: {history.partsUsed}</p>}
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
