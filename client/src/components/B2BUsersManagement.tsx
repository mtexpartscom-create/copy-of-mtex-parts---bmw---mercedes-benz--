/**
 * B2B Users Management Component
 * Admin panel for approving/rejecting B2B user registrations
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

export default function B2BUsersManagement() {
  const [selectedStatus, setSelectedStatus] = useState<"pending" | "approved" | "rejected">("pending");

  // Fetch B2B users
  const b2bUsersQuery = trpc.ecommerce.b2b.getAllUsers.useQuery({
    approvalStatus: selectedStatus,
  });

  // Mutations
  const approveMutation = trpc.ecommerce.b2b.approve.useMutation({
    onSuccess: () => {
      toast.success("Потребител одобрен успешно");
      b2bUsersQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Грешка при одобрение");
    },
  });

  const rejectMutation = trpc.ecommerce.b2b.reject.useMutation({
    onSuccess: () => {
      toast.success("Потребител отхвърлен успешно");
      b2bUsersQuery.refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Грешка при отхвърляне");
    },
  });

  const handleApprove = async (userId: number) => {
    await approveMutation.mutateAsync(userId);
  };

  const handleReject = async (userId: number) => {
    await rejectMutation.mutateAsync(userId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            На очакване
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Одобрен
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Отхвърлен
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>B2B Потребители</CardTitle>
          <CardDescription>Управление на B2B регистрации и одобрения</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Tabs */}
          <Tabs value={selectedStatus} onValueChange={(val) => setSelectedStatus(val as any)}>
            <TabsList>
              <TabsTrigger value="pending">На очакване</TabsTrigger>
              <TabsTrigger value="approved">Одобрени</TabsTrigger>
              <TabsTrigger value="rejected">Отхвърлени</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {b2bUsersQuery.isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Зареждане...</div>
              ) : b2bUsersQuery.data && b2bUsersQuery.data.length > 0 ? (
                <div className="space-y-3">
                  {b2bUsersQuery.data.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        {getStatusBadge(user.b2bApprovalStatus || "pending")}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Компания:</span>
                          <p className="font-medium">{user.companyName || "-"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ДДС номер:</span>
                          <p className="font-medium">{user.companyTaxId || "-"}</p>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Регистриран: {new Date(user.createdAt).toLocaleDateString("bg-BG")}
                      </div>

                      {selectedStatus === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(user.id)}
                            disabled={approveMutation.isPending}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Одобри
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(user.id)}
                            disabled={rejectMutation.isPending}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Отхвърли
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Няма потребители за одобрение
                </div>
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {b2bUsersQuery.isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Зареждане...</div>
              ) : b2bUsersQuery.data && b2bUsersQuery.data.length > 0 ? (
                <div className="space-y-3">
                  {b2bUsersQuery.data.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        {getStatusBadge(user.b2bApprovalStatus || "pending")}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Компания:</span>
                          <p className="font-medium">{user.companyName || "-"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ДДС номер:</span>
                          <p className="font-medium">{user.companyTaxId || "-"}</p>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Одобрен: {new Date(user.updatedAt).toLocaleDateString("bg-BG")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Няма одобрени потребители
                </div>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {b2bUsersQuery.isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Зареждане...</div>
              ) : b2bUsersQuery.data && b2bUsersQuery.data.length > 0 ? (
                <div className="space-y-3">
                  {b2bUsersQuery.data.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        {getStatusBadge(user.b2bApprovalStatus || "pending")}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Компания:</span>
                          <p className="font-medium">{user.companyName || "-"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ДДС номер:</span>
                          <p className="font-medium">{user.companyTaxId || "-"}</p>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Отхвърлен: {new Date(user.updatedAt).toLocaleDateString("bg-BG")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Няма отхвърлени потребители
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
