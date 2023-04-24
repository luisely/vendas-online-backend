/* eslint-disable prettier/prettier */

import * as bcrypt from 'bcrypt';

export const createPasswordHashed = async (
  password: string,
): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
};

export const validatePassword = async (
  password: string,
  passwordHashed: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, passwordHashed);
};
