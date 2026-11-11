import { z } from "zod";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address");

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80, "Name is too long"),
  email,
  // bcrypt only uses the first 72 bytes, so reject longer passwords instead of silently truncating.
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(72, "Use 72 characters or fewer"),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
