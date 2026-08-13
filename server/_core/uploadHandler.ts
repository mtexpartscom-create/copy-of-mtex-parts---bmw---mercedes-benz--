/**
 * Upload Handler - Handles image uploads to S3
 */

import { Express, Request, Response } from "express";
import multer from "multer";
import { storagePut } from "../storage";

const upload = multer({ storage: multer.memoryStorage() });

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function registerUploadRoutes(app: Express) {
  app.post("/api/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
      // Check if file exists in request
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const file = req.file;

      // Validate file type
      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return res.status(400).json({
          error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
        });
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return res.status(400).json({
          error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        });
      }

      // Validate filename
      if (!file.originalname || file.originalname.trim().length === 0) {
        return res.status(400).json({ error: "Invalid filename" });
      }

      const requestedFolder = typeof req.body?.folder === "string" ? req.body.folder : "listings";
      const folder = /^[a-z0-9_-]{1,32}$/i.test(requestedFolder) ? requestedFolder : "listings";
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileName = `${folder}/${Date.now()}_${safeName}`;

      // Upload to S3
      const { url } = await storagePut(fileName, file.buffer, file.mimetype);

      return res.json({ url });
    } catch (error) {
      console.error("[Upload] Error:", error);
      return res.status(500).json({ error: "Upload failed" });
    }
  });
}
