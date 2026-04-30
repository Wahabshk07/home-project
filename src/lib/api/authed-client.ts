import { spacingFetch } from "./api-request-spacing";
import { getApiBaseUrl } from "./env";

export class BackendRequestError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "BackendRequestError";
    this.status = status;
    this.body = body;
  }
}

function extractErrorMessage(
  status: number,
  statusText: string,
  data: unknown,
  rawBody: string,
): string {
  const obj = (data ?? {}) as {
    message?: string | string[];
    error?: string;
    statusCode?: number;
  };
  const parts: string[] = [];
  if (obj.message !== undefined) {
    parts.push(
      Array.isArray(obj.message) ? obj.message.join(". ") : String(obj.message),
    );
  } else if (typeof obj.error === "string" && obj.error.trim()) {
    parts.push(obj.error);
  }
  let base = parts.join(" ").trim() || statusText.trim() || "Request failed";
  if (base === "Request failed" && rawBody && data === null) {
    const snippet = rawBody.replace(/\s+/g, " ").slice(0, 140);
    if (status === 404) {
      base = `No proxy route (HTTP 404). Add /api/nest rewrites in next.config and restart dev. ${snippet}`;
    } else if (status === 502 || status === 504) {
      base = `Nest unreachable (${status}). Check API_UPSTREAM_URL and that the backend is running. ${snippet}`;
    } else {
      base = `${base}. ${snippet}`;
    }
  }
  return `${base} (HTTP ${status})`;
}

const NETWORK_ERROR_HINT =
  "Ensure ann-backend is running and API_UPSTREAM_URL in Next matches Nest’s URL/port. The browser uses same-origin /api/nest.";

function throwOnNetworkFailure(caught: unknown): never {
  const base =
    caught instanceof TypeError
      ? caught.message
      : caught instanceof Error
        ? caught.message
        : "Request failed";
  throw new BackendRequestError(503, `${base}. ${NETWORK_ERROR_HINT}`, caught);
}

async function spacingFetchWithNetworkHandling(
  path: string,
  headers: HeadersInit,
  init?: RequestInit,
): Promise<Response> {
  try {
    return await spacingFetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers: { ...headers, ...init?.headers },
    });
  } catch (e) {
    throwOnNetworkFailure(e);
  }
}

/** Prefer arrayBuffer + decode — more reliable than text() with some proxies/compression edge cases. */
async function readResponseTextSafe(res: Response): Promise<string> {
  try {
    const buf = await res.arrayBuffer();
    return new TextDecoder().decode(buf);
  } catch (e) {
    throwOnNetworkFailure(e);
  }
}

async function readResponseBlobSafe(res: Response): Promise<Blob> {
  try {
    return await res.blob();
  } catch (e) {
    throwOnNetworkFailure(e);
  }
}

export async function authedJson<T>(
  path: string,
  accessToken: string,
  init?: RequestInit,
): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  const isBodyless = method === "GET" || method === "HEAD";
  // GET + Content-Type: application/json forces an unnecessary CORS preflight
  // on cross-origin calls; omit it for bodyless requests.
  const res = await spacingFetchWithNetworkHandling(
    path,
    {
      Accept: "application/json",
      ...(isBodyless ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${accessToken}`,
    },
    init,
  );
  const text = await readResponseTextSafe(res);
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    throw new BackendRequestError(
      res.status,
      extractErrorMessage(res.status, res.statusText, data, text),
      data,
    );
  }
  return data as T;
}

/**
 * DELETE/POST etc. with empty 204/200 body. Treats 2xx with no JSON as success.
 */
export async function authedVoid(
  path: string,
  accessToken: string,
  init: RequestInit,
): Promise<void> {
  const res = await spacingFetchWithNetworkHandling(
    path,
    {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    init,
  );
  const text = await readResponseTextSafe(res);
  if (!res.ok) {
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    throw new BackendRequestError(
      res.status,
      extractErrorMessage(res.status, res.statusText, data, text),
      data,
    );
  }
}

/** Binary success body (e.g. PDF stream). On error, reads text and parses JSON when possible. */
export async function authedBlob(
  path: string,
  accessToken: string,
  init?: RequestInit,
): Promise<Blob> {
  const res = await spacingFetchWithNetworkHandling(
    path,
    { Authorization: `Bearer ${accessToken}` },
    init,
  );
  if (!res.ok) {
    const text = await readResponseTextSafe(res);
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }
    throw new BackendRequestError(
      res.status,
      extractErrorMessage(res.status, res.statusText, data, text),
      data,
    );
  }
  return readResponseBlobSafe(res);
}

/** POST multipart (do not set Content-Type — browser sets boundary). */
export async function authedMultipartJson<T>(
  path: string,
  accessToken: string,
  formData: FormData,
): Promise<T> {
  const res = await spacingFetchWithNetworkHandling(
    path,
    {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    { method: "POST", body: formData },
  );
  const text = await readResponseTextSafe(res);
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    throw new BackendRequestError(
      res.status,
      extractErrorMessage(res.status, res.statusText, data, text),
      data,
    );
  }
  return data as T;
}
