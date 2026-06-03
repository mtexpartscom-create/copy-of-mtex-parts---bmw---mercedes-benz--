/**
 * Product Management Component for Admin Panel
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProductManagement() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "0",
    compatibleBrands: "",
    compatibleModels: "",
    specifications: "",
    primaryImageUrl: "",
  });

  // Fetch categories
  const { data: categories = [] } = trpc.ecommerce.categories.getAll.useQuery();

  // Fetch products
  const { data: products = [], refetch: refetchProducts } =
    trpc.ecommerce.products.getAll.useQuery({
      categoryId: selectedCategory,
      status: "active",
    });

  // Mutations
  const createProductMutation = trpc.ecommerce.products.create.useMutation();
  const updateProductMutation = trpc.ecommerce.products.update.useMutation();
  const deleteProductMutation = trpc.ecommerce.products.delete.useMutation();

  const handleOpenForm = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        stock: product.stock.toString(),
        compatibleBrands: product.compatibleBrands || "",
        compatibleModels: product.compatibleModels || "",
        specifications: product.specifications || "",
        primaryImageUrl: product.primaryImageUrl || "",
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "0",
        compatibleBrands: "",
        compatibleModels: "",
        specifications: "",
        primaryImageUrl: "",
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Моля, въведете име на частта");
      return;
    }
    if (!formData.price.trim()) {
      toast.error("Моля, въведете цена");
      return;
    }
    if (!selectedCategory) {
      toast.error("Моля, изберете категория");
      return;
    }

    try {
      if (editingProduct) {
        await updateProductMutation.mutateAsync({
          id: editingProduct.id,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: parseInt(formData.stock) || 0,
          compatibleBrands: formData.compatibleBrands,
          compatibleModels: formData.compatibleModels,
          specifications: formData.specifications,
          primaryImageUrl: formData.primaryImageUrl,
        });
        toast.success("Частта е обновена успешно");
      } else {
        await createProductMutation.mutateAsync({
          categoryId: selectedCategory,
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: parseInt(formData.stock) || 0,
          compatibleBrands: formData.compatibleBrands,
          compatibleModels: formData.compatibleModels,
          specifications: formData.specifications,
          primaryImageUrl: formData.primaryImageUrl,
        });
        toast.success("Частта е добавена успешно");
      }

      setIsFormOpen(false);
      refetchProducts();
    } catch (error: any) {
      toast.error(error.message || "Грешка при запазване на частта");
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Сигурни ли сте, че искате да изтриете тази част?")) {
      return;
    }

    try {
      await deleteProductMutation.mutateAsync(productId);
      toast.success("Частта е изтрита успешно");
      refetchProducts();
    } catch (error: any) {
      toast.error(error.message || "Грешка при изтриване на частта");
    }
  };

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const createCategoryMutation = trpc.ecommerce.categories.create.useMutation();

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Въведете име на категория");
      return;
    }

    try {
      await createCategoryMutation.mutateAsync({ name: newCategoryName });
      toast.success("Категория създадена успешно");
      setNewCategoryName("");
      setIsCategoryDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Грешка при създаване на категория");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление на Части</h2>
        <div className="flex gap-2">
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Нова Категория
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Добави Нова Категория</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Име на категория *</label>
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Напр. Двигател, Трансмисия"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                    Отмяна
                  </Button>
                  <Button onClick={handleCreateCategory}>
                    Създай
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Добави Част
            </Button>
          </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Dialog for adding/editing products */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Редактирай Част" : "Добави Нова Част"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Категория *</label>
                <Select
                  value={selectedCategory?.toString() || ""}
                  onValueChange={(val) => setSelectedCategory(parseInt(val))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Изберете категория" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Име на Частта *</label>
                <Input
                  placeholder="Например: Филтър за маслото"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Описание</label>
                <Textarea
                  placeholder="Описание на частта..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Цена *</label>
                  <Input
                    placeholder="50.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Наличност</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Съвместими Марки</label>
                <Input
                  placeholder="BMW,Mercedes"
                  value={formData.compatibleBrands}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      compatibleBrands: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Съвместими Модели</label>
                <Textarea
                  placeholder="E90, E91, F30..."
                  value={formData.compatibleModels}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      compatibleModels: e.target.value,
                    })
                  }
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Спецификации (JSON)</label>
                <Textarea
                  placeholder='{"Тип": "OEM", "Производител": "BMW"}'
                  value={formData.specifications}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specifications: e.target.value,
                    })
                  }
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium">URL на Главна Снимка</label>
                <Input
                  placeholder="/manus-storage/..."
                  value={formData.primaryImageUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      primaryImageUrl: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={
                    createProductMutation.isPending ||
                    updateProductMutation.isPending
                  }
                >
                  {editingProduct ? "Обнови" : "Добави"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsFormOpen(false)}
                >
                  Отмяна
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      {/* Category Filter */}
      <div>
        <Select
          value={selectedCategory?.toString() || "all"}
          onValueChange={(val) =>
            setSelectedCategory(val === "all" ? undefined : parseInt(val))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всички категории</SelectItem>
            {categories.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Няма части в тази категория
          </div>
        ) : (
          products.map((product: any) => (
            <Card key={product.id} className="p-4 space-y-3">
              {product.primaryImageUrl && (
                <img
                  src={product.primaryImageUrl}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded"
                />
              )}
              <div>
                <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.price} лв.
                </p>
                <p className="text-xs text-muted-foreground">
                  Наличност: {product.stock}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleOpenForm(product)}
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Редактирай
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
