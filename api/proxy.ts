export const config = { runtime: "edge" };

const TMDB_BASE = "https://api.themoviedb.org/3";

export default async function handler(request: Request): Promise<Response> {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return json({ error: "TMDB_API_KEY is not configured." }, 500);
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/tmdb/, "");

  const target = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.forEach((value, key) => target.searchParams.set(key, value));
  target.searchParams.set("api_key", apiKey);

  try {
    const upstream = await fetch(target, {
      headers: { accept: "application/json" },
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") ?? "application/json",
        "cache-control": "public, max-age=0, s-maxage=300",
      },
    });
  } catch {
    return json({ error: "Upstream TMDB request failed." }, 502);
  }
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
