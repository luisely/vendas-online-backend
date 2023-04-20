import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './interfaces/user.entity';
import { ReturnUserDto } from './dtos/returnUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUser: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(createUser);
  }

  @Get()
  async getAllUser(): Promise<ReturnUserDto[]> {
    return (await this.userService.getAllUser()).map(
      (user) => new ReturnUserDto(user),
    );
  }

  @Get('/:userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.getUserByIdUsingRelations(userId),
    );
  }
}
