// Gemeinsame HTTP-Helfer
export const JSON_HEADERS = {
    "content-type": "application/json; charset=utf-8",
};

export function send(body, status = 200, headers = JSON_HEADERS) {
    return new Response(JSON.stringify(body), { status, headers });
}

export function bearer(req) {
    const auth = req.headers.get("authorization") || "";
    return auth.toLowerCase().startsWith("bearer ") ? auth.slice(7) : undefined;
    return auth.startsWith("Bearer ") ? auth.slice(7) : undefined;
}
