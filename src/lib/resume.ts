import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";

import { siteConfig } from "@/config/site";

/**
 * Reports whether the résumé PDF is present in `public/`.
 *
 * The check runs on the server at build or request time, so the download CTA
 * only appears when a real file will be served.
 */
export function hasResumeFile(): boolean {
  const relative = siteConfig.resumePath.replace(/^\/+/, "");
  return existsSync(path.join(process.cwd(), "public", relative));
}
