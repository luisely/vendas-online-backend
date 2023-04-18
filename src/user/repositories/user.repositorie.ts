/* eslint-disable prettier/prettier */
import { CreateUserDto } from '../dtos/createUser.dto';

export abstract class UserRepository {
  abstract create(createUserDto: CreateUserDto): Promise<void>;
}
