/* eslint-disable prettier/prettier */

import { UpdatePasswordDto } from '../dtos/updatePassword.dto';

export const updatePasswordMock: UpdatePasswordDto = {
  lastPassword: 'abc',
  newPassword: 'fdsafj',
};

export const updatePasswordInvalidMock: UpdatePasswordDto = {
  lastPassword: 'lkfdjsa',
  newPassword: 'flkjbla',
};
