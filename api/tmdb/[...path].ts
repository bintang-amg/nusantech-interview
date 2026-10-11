export const config = { runtime: "edge" };

const TMDB_BASE = "https://api.themoviedb.org/3";

export default async function handler(request: Request): Promise<Response> {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "TMDB_API_KEY is not configured." }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
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
    return new Response(
      JSON.stringify({ error: "Upstream TMDB request failed." }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }
}
