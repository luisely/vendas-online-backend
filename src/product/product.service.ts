import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateProductDto } from './dtos/createProduc.dto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find();

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
}
