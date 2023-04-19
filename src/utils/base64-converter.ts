/* eslint-disable prettier/prettier */
import { LoginPayload } from 'src/auth/dtos/loginPayload.dto';

export const authorizantionToLoginPayload = (
  authorization: string,
): LoginPayload | undefined => {
  const authorizationSplit = authorization.split('.');

  if (authorizationSplit.length < 3 || authorizantionToLoginPayload[1]) {
    return undefined;
  }

  return JSON.parse(
    Buffer.from(authorizationSplit[1], 'base64').toString('ascii'),
  );
};
