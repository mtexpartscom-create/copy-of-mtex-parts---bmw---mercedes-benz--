/**
 * Admin Dashboard - CRM Management System
 * Управление на клиенти, автомобили, заявки и резервации
 */

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Users, Car, FileText, Calendar, Facebook, Plus, Search, ShoppingCart, Package } from "lucide-react";
import ListingForm from "@/components/ListingForm";
import ListingCard from "@/components/ListingCard";
import ProductManagement from "@/components/ProductManagement";
import OrderManagement from "@/components/OrderManagement";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("customers");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data
  const customersQuery = trpc.crm.customers.list.useQuery();
  const inquiriesQuery = trpc.crm.inquiries.list.useQuery();
  const bookingsQuery = trpc.crm.bookings.list.useQuery();
  const listingsQuery = trpc.crm.listings.listAdmin.useQuery();

  // Mutations
  const deleteListingMutation = trpc.crm.listings.delete.useMutation({
    onSuccess: () => {
      toast.success("Обява изтрита успешно");
      listingsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Грешка при изтриване");
    },
  });

  const createCustomerMutation = trpc.crm.customers.create.useMutation({
    onSuccess: () => {
      toast.success("Клиент създаден успешно");
      customersQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Грешка при създаване на клиент");
    },
  });

  const createInquiryMutation = trpc.crm.inquiries.create.useMutation({
    onSuccess: () => {
      toast.success("Заявка създадена успешно");
      inquiriesQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Грешка при създаване на заявка");
    },
  });

  const createBookingMutation = trpc.crm.bookings.create.useMutation({
    onSuccess: () => {
      toast.success("Резервация създадена успешно");
      bookingsQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Грешка при създаване на резервация");
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Вход в админ панел</CardTitle>
            <CardDescription>Трябва да се логнете за достъп</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Влезте сега</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CRM Панел</h1>
            <p className="text-muted-foreground mt-1">Управление на клиенти и резервации</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Клиенти</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customersQuery.data?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Всички клиенти</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Заявки</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inquiriesQuery.data?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Части заявки</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Резервации</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingsQuery.data?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Предстоящи услуги</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Автомобили</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Регистрирани</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="customers">Клиенти</TabsTrigger>
            <TabsTrigger value="inquiries">Заявки</TabsTrigger>
            <TabsTrigger value="bookings">Резервации</TabsTrigger>
            <TabsTrigger value="listings">Обяви</TabsTrigger>
            <TabsTrigger value="products">Части</TabsTrigger>
            <TabsTrigger value="orders">Поръчки</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
          </TabsList>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление на клиенти</CardTitle>
                <CardDescription>Преглед и управление на всички клиенти</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Customer Form */}
                <div className="bg-muted p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold">Добавяне на нов клиент</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Име</Label>
                      <Input
                        id="customer-name"
                        placeholder="Име на клиент"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Телефон</Label>
                      <Input
                        id="customer-phone"
                        placeholder="Телефонен номер"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        id="customer-email"
                        type="email"
                        placeholder="Email адрес"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Град</Label>
                      <Input
                        id="customer-city"
                        placeholder="Град"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      const name = (document.getElementById("customer-name") as HTMLInputElement)?.value;
                      const phone = (document.getElementById("customer-phone") as HTMLInputElement)?.value;
                      const email = (document.getElementById("customer-email") as HTMLInputElement)?.value;
                      const city = (document.getElementById("customer-city") as HTMLInputElement)?.value;

                      if (!name || !phone) {
                        toast.error("Име и телефон са задължителни");
                        return;
                      }

                      createCustomerMutation.mutate({
                        name,
                        phone,
                        email: email || undefined,
                        city: city || undefined,
                      });
                    }}
                    disabled={createCustomerMutation.isPending}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавяне на клиент
                  </Button>
                </div>

                {/* Customers List */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Търсене по име или телефон..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                  </div>

                  {customersQuery.isLoading ? (
                    <p className="text-muted-foreground">Зареждане...</p>
                  ) : customersQuery.data && customersQuery.data.length > 0 ? (
                    <div className="space-y-2">
                      {customersQuery.data
                        .filter(
                          (c) =>
                            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.phone.includes(searchTerm)
                        )
                        .map((customer) => (
                          <div
                            key={customer.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                          >
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-muted-foreground">{customer.phone}</p>
                              {customer.email && (
                                <p className="text-sm text-muted-foreground">{customer.email}</p>
                              )}
                            </div>
                            <Button variant="outline" size="sm">
                              Преглед
                            </Button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">Няма клиенти</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление на заявки</CardTitle>
                <CardDescription>Преглед на всички заявки за части</CardDescription>
              </CardHeader>
              <CardContent>
                {inquiriesQuery.isLoading ? (
                  <p className="text-muted-foreground">Зареждане...</p>
                ) : inquiriesQuery.data && inquiriesQuery.data.length > 0 ? (
                  <div className="space-y-2">
                    {inquiriesQuery.data.map((inquiry) => (
                      <div
                        key={inquiry.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{inquiry.partName}</p>
                          <p className="text-sm text-muted-foreground">Статус: {inquiry.status}</p>
                          {inquiry.quotedPrice && (
                            <p className="text-sm text-green-600">Цена: {inquiry.quotedPrice}</p>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          Редактиране
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Няма заявки</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление на резервации</CardTitle>
                <CardDescription>Преглед на всички резервации за услуги</CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsQuery.isLoading ? (
                  <p className="text-muted-foreground">Зареждане...</p>
                ) : bookingsQuery.data && bookingsQuery.data.length > 0 ? (
                  <div className="space-y-2">
                    {bookingsQuery.data.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{booking.serviceType}</p>
                          <p className="text-sm text-muted-foreground">
                            Дата: {new Date(booking.bookingDate).toLocaleDateString("bg-BG")}
                          </p>
                          <p className="text-sm text-muted-foreground">Статус: {booking.status}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Редактиране
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Няма резервации</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Facebook Tab */}
          <TabsContent value="facebook" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  Facebook Публикации
                </CardTitle>
                <CardDescription>Автоматично публикуване на автомобили</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Функцията за автоматично публикуване на Facebook е в разработка.
                </p>
                <Button variant="outline" disabled>
                  Публикуване на автомобил
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-4">
            {/* Create Listing Form */}
            <ListingForm onSuccess={() => listingsQuery.refetch()} />

            {/* Listings List */}
            <Card>
              <CardHeader>
                <CardTitle>Управление на обяви</CardTitle>
                <CardDescription>Качване и управление на обяви на автомобили за продажба</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {listingsQuery.data && listingsQuery.data.length > 0 ? (
                    listingsQuery.data.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        onDelete={() => deleteListingMutation.mutate(listing.id)}
                        isDeleting={deleteListingMutation.isPending}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Няма обяви. Създай нова обява с формата по-горе.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление на Части</CardTitle>
                <CardDescription>Добавяне, редактиране и управление на авточасти</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление на Поръчки</CardTitle>
                <CardDescription>Преглед и управление на клиентски поръчки</CardDescription>
              </CardHeader>
              <CardContent>
                <OrderManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
