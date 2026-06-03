import { hashSync, compareSync, genSaltSync } from 'bcrypt';

export class PasswordUtil {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hashes a password using bcrypt.
   * @param password The plain text password.
   * @returns The hashed password.
   */
  static hash(password: string): string {
    const salt = genSaltSync(this.SALT_ROUNDS);
    return hashSync(password, salt);
  }

  /**
   * Compares a plain text password with a stored hash.
   * @param password The plain text password.
   * @param storedHash The stored hash.
   * @returns True if the password matches, false otherwise.
   */
  static compare(password: string, storedHash: string): boolean {
    if (!password || !storedHash) return false;
    return compareSync(password, storedHash);
  }
}
