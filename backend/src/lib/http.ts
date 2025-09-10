// Gemeinsame HTTP Helfer
export const JSON_HEADERS = {
    "content-type": "application/json; charset=utf-8",
} as const;

export function send(body: unknown, status = 200, headers: HeadersInit = JSON_HEADERS) {
    return new Response(JSON.stringify(body), { status, headers });
}

export function bearer(req: Request) {
    const auth = req.headers.get("authorization") || "";
    return auth.startsWith("Bearer ") ? auth.slice(7) : undefined;
}
