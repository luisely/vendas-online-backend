import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProductEntity } from './entities/cart-product.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InsertCart } from 'src/cart/dtos/insert-cart-dto';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { ProductService } from 'src/product/product.service';
import { UpdateCartDto } from 'src/cart/dtos/update-cart.dto';

@Injectable()
export class CartProductService {
  constructor(
    @InjectRepository(CartProductEntity)
    private readonly cartProductRepository: Repository<CartProductEntity>,
    private readonly productService: ProductService,
  ) {}

  async verifyProductInCart(
    productId: number,
    cartId: number,
  ): Promise<CartProductEntity> {
    const isProductAlreadyOnCart = await this.cartProductRepository.findOne({
      where: {
        productId,
        cartId,
      },
    });

    if (!isProductAlreadyOnCart) {
      throw new NotFoundException('Product not found in cart!');
    }

    return isProductAlreadyOnCart;
  }

  async createProductInCart(
    insertCart: InsertCart,
    cartId: number,
  ): Promise<CartProductEntity> {
    return this.cartProductRepository.save({
      amount: insertCart.amount,
      productId: insertCart.productId,
      cartId,
    });
  }

  async insertProductInCart(
    insertCart: InsertCart,
    cart: CartEntity,
  ): Promise<CartProductEntity> {
    await this.productService.findProductByid(insertCart.productId);

    const produtIsAlreadyInCart = await this.verifyProductInCart(
      insertCart.productId,
      cart.id,
    ).catch(() => undefined);

    if (!produtIsAlreadyInCart) {
      return this.createProductInCart(insertCart, cart.id);
    }

    return this.cartProductRepository.save({
      ...produtIsAlreadyInCart,
      amount: produtIsAlreadyInCart.amount + insertCart.amount,
    });
  }

  async updateProductInCart(
    updateCart: UpdateCartDto,
    cart: CartEntity,
  ): Promise<CartProductEntity> {
    await this.productService.findProductByid(updateCart.productId);

    const produtToUpdate = await this.verifyProductInCart(
      updateCart.productId,
      cart.id,
    );

    return this.cartProductRepository.save({
      ...produtToUpdate,
      amount: updateCart.amount,
    });
  }

  async deleteProductCart(
    productId: number,
    cartId: number,
  ): Promise<DeleteResult> {
    return this.cartProductRepository.delete({ productId, cartId });
  }
}
