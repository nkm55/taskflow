import bcrypt from "bcryptjs";

const ROUNDS = 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, ROUNDS);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// When a login email doesn't exist we still run one bcrypt compare against this hash,
// so "unknown email" and "wrong password" take the same time. Otherwise response timing
// would reveal which emails have accounts.
let dummyHash: Promise<string> | undefined;
export function getDummyHash(): Promise<string> {
  if (!dummyHash) {
    dummyHash = bcrypt.hash("timing-equalizer-not-a-real-password", ROUNDS);
  }
  return dummyHash;
}
