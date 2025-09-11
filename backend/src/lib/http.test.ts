import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { bearer } from "./http";

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

