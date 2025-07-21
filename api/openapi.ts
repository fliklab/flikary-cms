import { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const openApiPath = path.join(process.cwd(), "openapi.yaml");
    const openApiContent = fs.readFileSync(openApiPath, "utf-8");

    res.setHeader("Content-Type", "application/yaml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(200).send(openApiContent);
  } catch (error) {
    console.error("Error serving OpenAPI spec:", error);
    res.status(500).json({ error: "Failed to load OpenAPI specification" });
  }
}
