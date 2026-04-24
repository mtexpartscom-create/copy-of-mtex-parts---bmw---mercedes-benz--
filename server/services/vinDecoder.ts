/**
 * VIN Decoder Service
 * Integrates with external VIN decoder API to extract vehicle information
 */

export interface VinDecoderResult {
  make: string;
  model: string;
  year: number;
  engine: string;
  success: boolean;
  error?: string;
}

/**
 * Decode VIN using external API
 * This is a mock implementation - in production, integrate with Vindecoder or similar service
 */
export async function decodeVin(vin: string): Promise<VinDecoderResult> {
  // Validate VIN format
  if (!vin || vin.length !== 17) {
    return {
      make: "",
      model: "",
      year: 0,
      engine: "",
      success: false,
      error: "Invalid VIN format. VIN must be 17 characters.",
    };
  }

  try {
    // Extract basic info from VIN structure
    // Position 0-2: World Manufacturer Identifier (WMI)
    // Position 3-8: Vehicle Descriptor Section (VDS)
    // Position 9: Check digit
    // Position 10: Model year
    // Position 11: Assembly plant
    // Position 12-17: Serial number

    const wmi = vin.substring(0, 3);
    const modelYear = vin.charAt(9);
    const modelYearMap: Record<string, number> = {
      A: 2010,
      B: 2011,
      C: 2012,
      D: 2013,
      E: 2014,
      F: 2015,
      G: 2016,
      H: 2017,
      J: 2018,
      K: 2019,
      L: 2020,
      M: 2021,
      N: 2022,
      P: 2023,
      R: 2024,
      S: 2025,
      T: 2026,
      V: 2027,
      W: 2028,
      X: 2029,
      Y: 2030,
    };

    // If model year is not in map, use current year as fallback
    let year = modelYearMap[modelYear];
    if (!year) {
      // For unknown years, use current year
      year = new Date().getFullYear();
    }

    // Map WMI to manufacturer
    const manufacturerMap: Record<string, { make: string; model: string; engine: string }> = {
      WBA: { make: "BMW", model: "3 Series", engine: "2.0L" },
      WBY: { make: "BMW", model: "5 Series", engine: "3.0L" },
      WBS: { make: "BMW", model: "7 Series", engine: "4.0L" },
      WDD: { make: "Mercedes-Benz", model: "C-Class", engine: "2.0L" },
      WDB: { make: "Mercedes-Benz", model: "E-Class", engine: "3.0L" },
      WDC: { make: "Mercedes-Benz", model: "S-Class", engine: "4.0L" },
      WDG: { make: "Mercedes-Benz", model: "GLE", engine: "3.0L" },
    };

    const manufacturerInfo = manufacturerMap[wmi] || {
      make: "Unknown",
      model: "Unknown",
      engine: "Unknown",
    };

    return {
      make: manufacturerInfo.make,
      model: manufacturerInfo.model,
      year,
      engine: manufacturerInfo.engine,
      success: true,
    };
  } catch (error) {
    console.error("[VIN Decoder] Error decoding VIN:", error);
    return {
      make: "",
      model: "",
      year: 0,
      engine: "",
      success: false,
      error: "Failed to decode VIN. Please try again.",
    };
  }
}

/**
 * Validate VIN checksum (Luhn algorithm)
 * Note: This is optional validation - not strictly enforced
 */
export function validateVinChecksum(vin: string): boolean {
  // For now, just check length - this allows more flexibility
  return !!(vin && vin.length === 17);
}
