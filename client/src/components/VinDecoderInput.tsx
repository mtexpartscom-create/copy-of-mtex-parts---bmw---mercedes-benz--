/**
 * VIN Decoder Input Component
 * Позволява на потребителите да въведат VIN и автоматично попълва информацията за автомобила
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Check, AlertCircle } from "lucide-react";

interface VinDecoderInputProps {
  onVinDecoded?: (data: {
    vin: string;
    make: string;
    model: string;
    year: number;
    engine: string;
  }) => void;
  disabled?: boolean;
}

export default function VinDecoderInput({ onVinDecoded, disabled }: VinDecoderInputProps) {
  const [vin, setVin] = useState("");
  const [decodedData, setDecodedData] = useState<any>(null);
  const [isDecoding, setIsDecoding] = useState(false);

  const decodeVinMutation = trpc.crm.vinDecoder.decode.useQuery(vin, {
    enabled: false,
  });

  const handleDecodeVin = async () => {
    if (!vin || vin.length !== 17) {
      toast.error("VIN трябва да бъде точно 17 символа");
      return;
    }

    setIsDecoding(true);
    try {
      const result = await decodeVinMutation.refetch();
      if (result.data?.success && 'make' in result.data) {
        setDecodedData(result.data);
        toast.success("VIN декодиран успешно");
        onVinDecoded?.({
          vin,
          make: result.data.make || "",
          model: result.data.model || "",
          year: result.data.year || 0,
          engine: result.data.engine || "",
        });
      } else {
        toast.error(result.data?.error || "Не можа да се декодира VIN");
      }
    } catch (error) {
      toast.error("Грешка при декодиране на VIN");
    } finally {
      setIsDecoding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="vin-input">VIN номер</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="vin-input"
            placeholder="Въведете VIN (17 символа)"
            value={vin}
            onChange={(e) => {
              setVin(e.target.value.toUpperCase());
              setDecodedData(null);
            }}
            maxLength={17}
            disabled={disabled || isDecoding}
            className="font-mono"
          />
          <Button
            onClick={handleDecodeVin}
            disabled={disabled || isDecoding || vin.length !== 17}
            variant="outline"
          >
            {isDecoding ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Декодиране...
              </>
            ) : (
              "Декодиране"
            )}
          </Button>
        </div>
      </div>

      {decodedData && decodedData.success && 'make' in decodedData && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Успешно декодиран VIN</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Производител</p>
              <p className="font-semibold">{(decodedData as any).make}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Модел</p>
              <p className="font-semibold">{(decodedData as any).model}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Година</p>
              <p className="font-semibold">{(decodedData as any).year}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Двигател</p>
              <p className="font-semibold">{(decodedData as any).engine}</p>
            </div>
          </div>
        </div>
      )}

      {decodedData && !decodedData.success && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-700 dark:text-red-300">{decodedData.error}</p>
        </div>
      )}
    </div>
  );
}
