import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { bearer, send } from "./http.js";

describe("bearer", () => {
    it("extracts token from Authorization header", () => {
        const token = "abc123";
        const req = new Request("http://example.com", {
            headers: { authorization: `Bearer ${token}` },
        });
        assert.equal(bearer(req), token);
    });

    it("returns undefined when header is missing", () => {
        const req = new Request("http://example.com");
        assert.equal(bearer(req), undefined);
    });

    it("returns undefined for malformed header", () => {
        const req = new Request("http://example.com", {
            headers: { authorization: "Bearer" },
        });
        assert.equal(bearer(req), undefined);
    });
});

describe("send", () => {
    it("returns response with JSON body and status", async () => {
        const res = send({ ok: true }, 201);
        assert.equal(res.status, 201);
        assert.equal(res.headers.get("content-type"), "application/json; charset=utf-8");
        assert.deepEqual(await res.json(), { ok: true });
    });
});
