import {
  Injectable,
  NotFoundException,
  BadGatewayException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserEntity } from './interfaces/user.entity';

import { UserType } from './enum/user-type.enum';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { createPasswordHashed, validatePassword } from 'src/utils/password';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly useRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.getUserByEmail(createUserDto.email).catch(
      () => undefined,
    );

    if (user) {
      throw new BadGatewayException('Email já registrado');
    }

    const password = await createPasswordHashed(createUserDto.password);

    return this.useRepository.save({
      ...createUserDto,
      typeUser: UserType.User,
      password,
    });
  }

  async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
    return this.useRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        addresses: {
          city: {
            state: true,
          },
        },
      },
    });
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.useRepository.find();
  }

  async getUserById(userId: number): Promise<UserEntity> {
    const user = await this.useRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('UserId Not Found');
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.useRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('Email Not Found');
    }

    return user;
  }

  async updatePasswordUser(
    updatePassword: UpdatePasswordDto,
    userId: number,
  ): Promise<UserEntity> {
    const user = await this.getUserById(userId);

    const passwordHashed = await createPasswordHashed(
      updatePassword.newPassword,
    );

    const isMatch = await validatePassword(
      updatePassword.lastPassword,
      user.password || '',
    );

    if (!isMatch) {
      throw new BadRequestException('Last password invalid');
    }

    return this.useRepository.save({
      ...user,
      password: passwordHashed,
    });
  }
}
