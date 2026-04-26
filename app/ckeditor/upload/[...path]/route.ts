import { editorImagePublicUrlCandidates } from "@/lib/server/supabase-admin";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { path } = await context.params;
  const storagePath = path.join("/");
  const candidates = editorImagePublicUrlCandidates(storagePath);

  for (const url of candidates) {
    try {
      const response = await fetch(url, { cache: "no-store" });

      if (response.ok && response.body) {
        const headers = new Headers();
        const contentType = response.headers.get("content-type") ?? contentTypeFromPath(storagePath);
        const cacheControl = response.headers.get("cache-control") ?? "public, max-age=31536000, immutable";

        headers.set("content-type", contentType);
        headers.set("cache-control", cacheControl);

        const contentLength = response.headers.get("content-length");

        if (contentLength) {
          headers.set("content-length", contentLength);
        }

        return new Response(response.body, {
          status: 200,
          headers,
        });
      }
    } catch {
      // Fall through to the next legacy path shape.
    }
  }

  return new Response("Image not found", { status: 404 });
}

function contentTypeFromPath(path: string) {
  const normalizedPath = path.toLowerCase();

  if (normalizedPath.endsWith(".png")) {
    return "image/png";
  }

  if (normalizedPath.endsWith(".webp")) {
    return "image/webp";
  }

  if (normalizedPath.endsWith(".gif")) {
    return "image/gif";
  }

  return "image/jpeg";
}
