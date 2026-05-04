const DEFAULT_ORIGIN = "https://exam-app.elevate-bootcamp.cloud";

export function getApiOrigin(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_API_ORIGIN ?? process.env.API_ORIGIN ?? DEFAULT_ORIGIN;
  return fromEnv.replace(/\/$/, "");
}

/** Base URL for REST routes, e.g. `https://host/api` */
export function getApiBase(): string {
  const explicit = (process.env.NEXT_PUBLIC_API_URL ?? process.env.API)?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  return `${getApiOrigin()}/api`;
}

export function authHeaders(accessToken: string): HeadersInit {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export function jsonAuthHeaders(accessToken: string): HeadersInit {
  return {
    ...authHeaders(accessToken),
    "Content-Type": "application/json",
  };
}

export function isApiFailure(body: unknown): boolean {
  return (
    typeof body === "object" &&
    body !== null &&
    "status" in body &&
    (body as { status: unknown }).status === false
  );
}

export function apiErrorMessage(body: unknown, fallback: string): string {
  if (typeof body === "object" && body !== null && "message" in body) {
    const m = (body as { message: unknown }).message;
    if (typeof m === "string" && m.length) return m;
  }
  return fallback;
}

/** Parse JSON from an API response; avoids throwing on HTML error pages. */
/** Normalize login JSON whether the API returns flat `{ token, user }` or wrapped `{ payload: { token, user } }`. */
export function extractLoginPayload(raw: unknown): {
  token?: string;
  user?: Record<string, unknown>;
} {
  if (!raw || typeof raw !== "object") return {};
  const r = raw as Record<string, unknown>;
  let token: string | undefined;
  let user: Record<string, unknown> | undefined;

  if (typeof r.token === "string") token = r.token;
  if (r.user && typeof r.user === "object" && !Array.isArray(r.user)) {
    user = r.user as Record<string, unknown>;
  }

  const payload = r.payload;
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const p = payload as Record<string, unknown>;
    if (!token && typeof p.token === "string") token = p.token;
    if (!user && p.user && typeof p.user === "object" && !Array.isArray(p.user)) {
      user = p.user as Record<string, unknown>;
    }
  }

  const data = r.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const d = data as Record<string, unknown>;
    if (!token && typeof d.token === "string") token = d.token;
    if (!user && d.user && typeof d.user === "object" && !Array.isArray(d.user)) {
      user = d.user as Record<string, unknown>;
    }
  }

  return { token, user };
}

export async function readApiJson(response: Response): Promise<unknown> {
  const text = await response.text();
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Empty response from server.");
  }
  if (trimmed.startsWith("<")) {
    throw new Error(
      "Login received HTML instead of JSON. Your API URL is probably wrong: set API and NEXT_PUBLIC_API_URL to the backend base including /api (for example https://exam-app.elevate-bootcamp.cloud/api)."
    );
  }
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    throw new Error("Invalid JSON from login service.");
  }
}
