import React, { useEffect, useMemo, useState } from "react";
import { Facebook, ImagePlus, RefreshCw, Save, Send, Upload } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT_CONTACT_PHONE = "+359 898 606 626";

function createSuggestedCaption(model: string, engine: string, parts: string[]) {
  const partsText = parts.length > 0 ? `\n\n🔧 Налични части:\n${parts.map((part) => `• ${part}`).join("\n")}` : "";
  return `🚗 ${model} — ${engine}\n\n📞 Контакт: ${DEFAULT_CONTACT_PHONE}\n\nОригинални OEM авточасти за този автомобил.${partsText}\n\n✨ Свържете се с MTEX PARTS за повече информация!`;
}

export default function FacebookPostReview() {
  const listingsQuery = trpc.crm.listings.listAdmin.useQuery();
  const postsQuery = trpc.crm.facebook.list.useQuery();
  const createDraftMutation = trpc.crm.facebook.createDraft.useMutation();
  const updateDraftMutation = trpc.crm.facebook.updateDraft.useMutation();
  const publishMutation = trpc.crm.facebook.publish.useMutation();

  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [partsText, setPartsText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editedCaptions, setEditedCaptions] = useState<Record<number, string>>({});
  const [editedImages, setEditedImages] = useState<Record<number, string | null>>({});

  const selectedListing = useMemo(
    () => listingsQuery.data?.find((listing) => listing.id === selectedListingId),
    [listingsQuery.data, selectedListingId]
  );

  useEffect(() => {
    if (!selectedListing) return;
    const model = `${selectedListing.make} ${selectedListing.model}`;
    const engine = selectedListing.engine || "OEM";
    setCaption(createSuggestedCaption(model, engine, partsText.split("\n").map((part) => part.trim()).filter(Boolean)));
  }, [selectedListing, partsText]);

  const uploadImage = async (file: File, postId?: number) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Избери JPG, PNG, WEBP или GIF изображение.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Изображението трябва да е до 10 MB.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "facebook");
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) throw new Error(payload.error || "Качването не успя");
      if (postId) {
        setEditedImages((current) => ({ ...current, [postId]: payload.url! }));
      } else {
        setImageUrl(payload.url);
      }
      toast.success("Изображението е качено.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Грешка при качване на изображението");
    } finally {
      setUploading(false);
    }
  };

  const createDraft = async () => {
    if (!selectedListing) {
      toast.error("Избери автомобил от списъка.");
      return;
    }
    try {
      await createDraftMutation.mutateAsync({
        vehicleId: selectedListing.id,
        vehicleModel: `${selectedListing.make} ${selectedListing.model}`,
        engine: selectedListing.engine || "OEM",
        availableParts: partsText.split("\n").map((part) => part.trim()).filter(Boolean),
        contactPhone: DEFAULT_CONTACT_PHONE,
        imageUrl: imageUrl || undefined,
        customCaption: caption.trim() || undefined,
      });
      toast.success("Черновата публикация е запазена за преглед.");
      await postsQuery.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Неуспешно създаване на чернова");
    }
  };

  const saveDraft = async (postId: number, postCaption: string | null, postImageUrl: string | null) => {
    const nextCaption = (editedCaptions[postId] ?? postCaption ?? "").trim();
    if (!nextCaption) {
      toast.error("Текстът на публикацията не може да е празен.");
      return;
    }
    try {
      await updateDraftMutation.mutateAsync({ id: postId, caption: nextCaption, imageUrl: postImageUrl });
      toast.success("Черновата е обновена.");
      await postsQuery.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Неуспешно записване на черновата");
    }
  };

  const publishPost = async (post: NonNullable<typeof postsQuery.data>[number]) => {
    const listing = listingsQuery.data?.find((item) => item.id === post.vehicleId);
    if (!listing) {
      toast.error("Свързаният автомобил не е намерен.");
      return;
    }
    const nextCaption = (editedCaptions[post.id] || post.caption || "").trim();
    const currentImage = Object.prototype.hasOwnProperty.call(editedImages, post.id)
      ? editedImages[post.id]
      : (post.imageUrl ?? null);
    if (!nextCaption) {
      toast.error("Добави текст преди публикуване.");
      return;
    }
    try {
      await publishMutation.mutateAsync({
        id: post.id,
        vehicleModel: `${listing.make} ${listing.model}`,
        engine: listing.engine || "OEM",
        availableParts: [],
        contactPhone: DEFAULT_CONTACT_PHONE,
        imageUrl: currentImage || undefined,
        customCaption: nextCaption,
      });
      toast.success("Публикацията е обработена в симулационен режим.");
      await postsQuery.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Неуспешно публикуване");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Facebook className="h-5 w-5 text-blue-600" /> Създай публикация</CardTitle>
          <CardDescription>Качи изображение, редактирай текста и запази чернова за преглед преди публикуване.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook-listing">Автомобил от обявите</Label>
              <select
                id="facebook-listing"
                value={selectedListingId ?? ""}
                onChange={(event) => setSelectedListingId(event.target.value ? Number(event.target.value) : null)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Избери автомобил</option>
                {listingsQuery.data?.map((listing) => (
                  <option key={listing.id} value={listing.id}>{listing.make} {listing.model} {listing.year || ""}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook-parts">Налични части (по една на ред)</Label>
              <Input id="facebook-parts" value={partsText} onChange={(event) => setPartsText(event.target.value)} placeholder="Двигател\nСкоростна кутия" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook-image">Изображение</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Input id="facebook-image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => event.target.files?.[0] && uploadImage(event.target.files[0])} disabled={uploading} />
                {uploading && <span className="text-sm text-muted-foreground">Качване...</span>}
              </div>
              {imageUrl && <img src={imageUrl} alt="Преглед на Facebook изображението" className="mt-2 aspect-video max-h-56 w-full rounded-lg object-cover" />}
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="facebook-caption">Текст на публикацията</Label>
            <Textarea id="facebook-caption" value={caption} onChange={(event) => setCaption(event.target.value)} rows={12} placeholder="Избери автомобил за автоматично предложение на текст." />
            <Button type="button" onClick={createDraft} disabled={createDraftMutation.isPending || !selectedListing} className="w-full gap-2"><Save className="h-4 w-4" /> Запази чернова</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div><CardTitle>Чернови и публикации</CardTitle><CardDescription>Преглед и редакция преди публикуване.</CardDescription></div>
          <Button type="button" variant="outline" size="sm" onClick={() => postsQuery.refetch()} disabled={postsQuery.isFetching} className="gap-2"><RefreshCw className="h-4 w-4" /> Обнови</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">Facebook Graph API е оставен в симулационен режим, докато не бъдат добавени Page ID и access token. Този бутон не изпраща реална външна публикация.</p>
          {postsQuery.isLoading ? <p className="text-sm text-muted-foreground">Зареждане...</p> : postsQuery.data?.length ? postsQuery.data.map((post) => {
            const listing = listingsQuery.data?.find((item) => item.id === post.vehicleId);
            const currentCaption = editedCaptions[post.id] ?? post.caption ?? "";
            const currentImage = Object.prototype.hasOwnProperty.call(editedImages, post.id)
      ? editedImages[post.id]
      : (post.imageUrl ?? null);
            return (
              <div key={post.id} className="grid gap-4 rounded-xl border p-4 lg:grid-cols-[180px_minmax(0,1fr)_auto]">
                <div className="space-y-2">
                  {currentImage ? <img src={currentImage} alt="Facebook публикация" className="aspect-square w-full rounded-lg object-cover" /> : <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground"><ImagePlus className="h-8 w-8" /></div>}
                  {post.status !== "published" && <div className="space-y-2">
                    <Label htmlFor={`facebook-image-${post.id}`} className="text-xs">Замени изображението</Label>
                    <Input id={`facebook-image-${post.id}`} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => event.target.files?.[0] && uploadImage(event.target.files[0], post.id)} disabled={uploading} />
                    {currentImage && <Button type="button" variant="ghost" size="sm" onClick={() => setEditedImages((current) => ({ ...current, [post.id]: null }))}>Премахни изображение</Button>}
                  </div>}
                  <p className="text-xs text-muted-foreground">{listing ? `${listing.make} ${listing.model}` : `Обява #${post.vehicleId}`}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`facebook-post-${post.id}`}>Текст</Label>
                  <Textarea id={`facebook-post-${post.id}`} value={currentCaption} onChange={(event) => setEditedCaptions((current) => ({ ...current, [post.id]: event.target.value }))} rows={6} disabled={post.status === "published"} />
                  <p className="text-xs text-muted-foreground">Създадено: {new Date(post.createdAt).toLocaleString("bg-BG")}</p>
                </div>
                <div className="flex flex-row flex-wrap items-start gap-2 lg:flex-col">
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">{post.status === "published" ? "Публикувано" : post.status === "failed" ? "Неуспешно" : "Чернова"}</span>
                  {post.status !== "published" && <>
                    <Button type="button" variant="outline" size="sm" onClick={() => saveDraft(post.id, currentCaption, currentImage)} disabled={updateDraftMutation.isPending} className="gap-2"><Save className="h-4 w-4" /> Запази</Button>
                    <Button type="button" size="sm" onClick={() => publishPost(post)} disabled={publishMutation.isPending} className="gap-2"><Send className="h-4 w-4" /> Публикувай (симулация)</Button>
                  </>}
                </div>
              </div>
            );
          }) : <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground"><Upload className="mx-auto mb-2 h-6 w-6" />Все още няма чернови за преглед.</div>}
        </CardContent>
      </Card>
    </div>
  );
}
