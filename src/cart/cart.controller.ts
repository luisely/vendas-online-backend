import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/user/enum/user-type.enum';
import { InsertCart } from './dtos/insert-cart-dto';
import { CartEntity } from './entities/cart.entity';
import { CartService } from './cart.service';
import { UserId } from 'src/decorators/user-id.decorator';

@Roles(UserType.User, UserType.Admin)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async createCart(
    @Body() insertCart: InsertCart,
    @UserId() userId: number,
  ): Promise<CartEntity> {
    return this.cartService.insertProductInCart(insertCart, userId);
  }
}
