import { compareSync, hashSync } from 'bcryptjs';
/**
 * A function that is used to incrypt the password using the bcryptjs
 * @param value
 * @returns
 */
export const hashPassword = (value) => {
  return hashSync(value, 10);
};
/**
 * A fucntion that used to compare a plaintext password with the hashed password
 * @param password
 * @param hash
 * @returns boolean
 */
export const comparePassword = (password: string, hash: string) => {
  return compareSync(password, hash);
};