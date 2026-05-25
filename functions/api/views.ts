type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
  run: () => Promise<unknown>;
};

type D1Database = {
  prepare: (query: string) => D1PreparedStatement;
};

type Env = {
  BLOG_ANALYTICS_DB?: D1Database;
};

type PagesContext = {
  request: Request;
  env: Env;
};

const SITE_VIEWS_KEY = "site_views";

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...init?.headers,
    },
  });
}

function normalizePathname(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed.startsWith("/")) return null;

  try {
    const pathname = new URL(trimmed, "https://example.com").pathname;
    return pathname.replace(/\/{2,}/g, "/") || "/";
  } catch {
    return null;
  }
}

async function ensureSchema(db: D1Database) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS page_views (
        pathname TEXT PRIMARY KEY,
        views INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS site_stats (
        key TEXT PRIMARY KEY,
        value INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    )
    .run();
}

async function getCounts(db: D1Database, pathname: string) {
  const page = await db
    .prepare("SELECT views FROM page_views WHERE pathname = ?")
    .bind(pathname)
    .first<{ views: number }>();

  const site = await db
    .prepare("SELECT value FROM site_stats WHERE key = ?")
    .bind(SITE_VIEWS_KEY)
    .first<{ value: number }>();

  return {
    pathname,
    pageViews: Number(page?.views ?? 0),
    siteViews: Number(site?.value ?? 0),
  };
}

export async function onRequestGet({ request, env }: PagesContext) {
  if (!env.BLOG_ANALYTICS_DB) {
    return json({ error: "Missing BLOG_ANALYTICS_DB binding" }, { status: 500 });
  }

  const url = new URL(request.url);
  const pathname = normalizePathname(url.searchParams.get("pathname"));
  if (!pathname) {
    return json({ error: "Invalid pathname" }, { status: 400 });
  }

  await ensureSchema(env.BLOG_ANALYTICS_DB);
  return json(await getCounts(env.BLOG_ANALYTICS_DB, pathname));
}

export async function onRequestPost({ request, env }: PagesContext) {
  if (!env.BLOG_ANALYTICS_DB) {
    return json({ error: "Missing BLOG_ANALYTICS_DB binding" }, { status: 500 });
  }

  let body: { pathname?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const pathname = normalizePathname(body.pathname);
  if (!pathname) {
    return json({ error: "Invalid pathname" }, { status: 400 });
  }

  const db = env.BLOG_ANALYTICS_DB;
  await ensureSchema(db);

  await db
    .prepare(
      `INSERT INTO page_views (pathname, views, updated_at)
       VALUES (?, 1, CURRENT_TIMESTAMP)
       ON CONFLICT(pathname) DO UPDATE SET
         views = views + 1,
         updated_at = CURRENT_TIMESTAMP`
    )
    .bind(pathname)
    .run();

  await db
    .prepare(
      `INSERT INTO site_stats (key, value, updated_at)
       VALUES (?, 1, CURRENT_TIMESTAMP)
       ON CONFLICT(key) DO UPDATE SET
         value = value + 1,
         updated_at = CURRENT_TIMESTAMP`
    )
    .bind(SITE_VIEWS_KEY)
    .run();

  return json(await getCounts(db, pathname));
}
