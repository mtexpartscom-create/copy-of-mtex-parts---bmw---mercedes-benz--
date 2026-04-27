/**
 * Upload Handler - Handles image uploads to S3
 */

import { Express, Request, Response } from "express";
import multer from "multer";
import { storagePut } from "../storage";

const upload = multer({ storage: multer.memoryStorage() });

export function registerUploadRoutes(app: Express) {
  app.post("/api/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
      // Check if file exists in request
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const file = req.file;
      const fileName = `listings/${Date.now()}_${file.originalname}`;

      // Upload to S3
      const { url } = await storagePut(
        fileName,
        file.buffer,
        file.mimetype
      );

      return res.json({ url });
    } catch (error) {
      console.error("[Upload] Error:", error);
      return res.status(500).json({ error: "Upload failed" });
    }
  });
}
