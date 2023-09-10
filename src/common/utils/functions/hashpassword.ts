import * as bcrypt from 'bcrypt';

export function hashpassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(
  passwordClient: string,
  passwordDB: string,
): boolean {
  return bcrypt.compareSync(passwordClient, passwordDB);
}
