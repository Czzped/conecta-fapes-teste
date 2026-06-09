import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import test from "node:test";

import { importPKCS8 } from "jose";

import { normalizePrivateKey } from "../src/github/app-auth.js";

test("normalizes escaped newlines in PKCS#8 GitHub App keys", () => {
  const key = "-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----";

  assert.equal(
    normalizePrivateKey(key),
    "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----"
  );
});

test("converts PKCS#1 RSA GitHub App keys to PKCS#8 for jose", async () => {
  const { privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: { format: "pem", type: "pkcs1" },
    publicKeyEncoding: { format: "pem", type: "spki" },
  });

  const normalized = normalizePrivateKey(privateKey);

  assert.match(normalized, /-----BEGIN PRIVATE KEY-----/);
  await assert.doesNotReject(importPKCS8(normalized, "RS256"));
});
