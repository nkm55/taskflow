import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "@/lib/validation";

describe("signupSchema", () => {
  const valid = { name: "Ada Lovelace", email: "ada@example.com", password: "correct-horse" };

  it("accepts valid input", () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it("normalizes email to trimmed lowercase", () => {
    const result = signupSchema.parse({ ...valid, email: "  Ada@Example.COM " });
    expect(result.email).toBe("ada@example.com");
  });

  it("rejects short passwords", () => {
    const result = signupSchema.safeParse({ ...valid, password: "short" });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.password).toBeDefined();
  });

  it("rejects passwords longer than bcrypt's 72-byte limit", () => {
    const result = signupSchema.safeParse({ ...valid, password: "x".repeat(73) });
    expect(result.success).toBe(false);
  });

  it("rejects a blank name", () => {
    expect(signupSchema.safeParse({ ...valid, name: "   " }).success).toBe(false);
  });

  it("rejects malformed email", () => {
    expect(signupSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires a password", () => {
    const result = loginSchema.safeParse({ email: "ada@example.com", password: "" });
    expect(result.success).toBe(false);
  });
});
