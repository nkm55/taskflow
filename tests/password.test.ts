import { describe, expect, it } from "vitest";
import { getDummyHash, hashPassword, verifyPassword } from "@/lib/auth/password";

describe("password hashing", () => {
  it("verifies the correct password", async () => {
    const hash = await hashPassword("correct-horse");
    expect(await verifyPassword("correct-horse", hash)).toBe(true);
  });

  it("rejects a wrong password", async () => {
    const hash = await hashPassword("correct-horse");
    expect(await verifyPassword("battery-staple", hash)).toBe(false);
  });

  it("never stores the plain password", async () => {
    const hash = await hashPassword("correct-horse");
    expect(hash).not.toContain("correct-horse");
  });

  it("salts hashes, so the same password hashes differently each time", async () => {
    const [a, b] = await Promise.all([hashPassword("same"), hashPassword("same")]);
    expect(a).not.toBe(b);
  });

  it("dummy hash never matches a user's password", async () => {
    expect(await verifyPassword("anything", await getDummyHash())).toBe(false);
  });
});
