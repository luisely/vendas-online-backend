import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { DeleteResult, In, Repository } from 'typeorm';
import { CreateProductDto } from './dtos/createProduc.dto';
import { CategoryService } from 'src/category/category.service';
import { UpdateProductDto } from './dtos/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService,
  ) {}

  async findAll(productId?: number[]): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: In(productId),
        },
      };
    }

    const products = await this.productRepository.find(findOptions);

    if (!products || products.length === 0) {
      throw new NotFoundException('Product list is empty');
    }

    return products;
  }

  async findProductByid(productId: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found!');
    }

    return product;
  }

  async createProduct(product: CreateProductDto): Promise<ProductEntity> {
    await this.categoryService.findCategoryById(product.categoryId);

    return this.productRepository.save({
      ...product,
    });
  }

  async deleteProductById(productId: number): Promise<DeleteResult> {
    await this.findProductByid(productId);

    return this.productRepository.delete({ id: productId });
  }

  async updateProduct(
    updateProduct: UpdateProductDto,
    productId: number,
  ): Promise<ProductEntity> {
    const product = await this.findProductByid(productId);

    return this.productRepository.save({
      ...product,
      ...updateProduct,
    });
  }
}
