import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReturnCategory } from './dtos/returnCategory.dtos';
import { CategoryService } from './category.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/user/enum/user-type.enum';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dtos/createCategory.dto';

@Roles(UserType.User, UserType.Admin)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAllCategories(): Promise<ReturnCategory[]> {
    return (await this.categoryService.findAllCategories()).map(
      (category) => new ReturnCategory(category),
    );
  }

  @Roles(UserType.Admin)
  @Post()
  async createCategory(
    @Body() createCategory: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoryService.createCategory(createCategory);
  }
}
