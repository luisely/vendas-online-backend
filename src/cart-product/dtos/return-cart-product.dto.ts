/* eslint-disable prettier/prettier */
import { ReturnCartDto } from '../../cart/dtos/return-cart.dto';
import { ReturnProduct } from '../../product/dtos/returnProduct.dto';
import { CartProductEntity } from '../entities/cart-product.entity';

export class ReturnCartProductDto {
  id: number;
  cartId: number;
  amount: number;
  productId: number;
  product?: ReturnProduct;
  cart?: ReturnCartDto;

  constructor(cartProduct: CartProductEntity) {
    this.id = cartProduct.id;
    this.cartId = cartProduct.cartId;
    this.amount = cartProduct.amount;
    this.productId = cartProduct.productId;
    this.product = cartProduct.product
      ? new ReturnProduct(cartProduct.product)
      : undefined;
    this.cart = cartProduct.cart
      ? new ReturnCartDto(cartProduct.cart)
      : undefined;
  }
}
