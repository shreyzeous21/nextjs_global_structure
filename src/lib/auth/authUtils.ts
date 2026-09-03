import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export const passwordHash = {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },
};

export type UserRole =
  | "superadmin"
  | "admin"
  | "company"
  | "companychild"
  | "vendor"
  | "vendorchild";
