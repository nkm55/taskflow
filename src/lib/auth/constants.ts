// Kept separate from session.ts so middleware (Edge runtime) can import it
// without pulling in Prisma or Node crypto.
export const SESSION_COOKIE = "tf_session";
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
