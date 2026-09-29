export const dynamic = "force-dynamic";

/**
 * Lightweight liveness endpoint used by the Docker HEALTHCHECK and by reverse
 * proxies. It intentionally reveals nothing about configuration.
 */
export function GET() {
  return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
