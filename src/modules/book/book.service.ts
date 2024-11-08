import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { bookEntity } from 'src/model/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { categoryEntity } from 'src/model/category.entity';
import { userEntity } from 'src/model/user.entity';
import { In, Repository } from 'typeorm';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(bookEntity)
    private bookRepo: Repository<bookEntity>,
    @InjectRepository(categoryEntity)
    private categoryRepo: Repository<categoryEntity>,
    @InjectRepository(userEntity)
    private userRepo: Repository<userEntity>
  ) { }
  async create(sellerId: string, createBookDto: CreateBookDto, photo: string) {
    const { title, description, price, condition, publisher, author, edition, categoryIds } = createBookDto;

    // // Check if a book with the same title already exists
    // const existingBook = await this.userRepo.findOne({ where: { id: sellerId, categories: { books: { title: title } } } });
    // if (existingBook) {
    //   throw new BadRequestException('A book with the given title already exists');
    // }


    // Fetch categories based on provided category IDs and verify them
    const categories = await this.categoryRepo.find({
      where: { id: In(categoryIds) }
    });

    if (categories.length !== categoryIds.length) {
      throw new BadRequestException("Some category IDs are invalid");
    }

    // Check if the seller exists
    const seller = await this.userRepo.findOne({ where: { id: sellerId } });
    if (!seller) {
      throw new NotFoundException("Seller not found");
    }


    const book = new bookEntity()
    book.author = author
    book.categories = categories;
    book.conditon = condition;
    book.description = description;
    book.edition = edition;
    book.photo = photo;
    book.price = price;
    book.publisher = publisher;
    book.title = title;

    const savedBook = await this.bookRepo.save(book);

    return {
      message: "Book added successfully.",
      data: savedBook,
    };
  }
  // async create(id, createBookDto: CreateBookDto, photo: string) {

  //   const { title, description, price, conditon, publisher, author, edition } = createBookDto;

  //    // Find the seller by ID
  //    const seller = await this.userRepo.findOne({ where: { id } });
  //    if (!seller) {
  //        throw new BadRequestException("Seller not found");
  //    }
  //   // Check if a product with the same name already exists
  //   const existingBook = await this.bookRepo.findOne({ where: { title, } });

  //   if (existingProduct) {
  //     throw new BadRequestException('Product with the given name already exists');
  //   }

  //   const categories = await this.categoryRepo.find({
  //     where: { id: In(categoryIds) }
  //   });


  //   if (categories.length !== categoryIds.length) {
  //     throw new BadRequestException("Some invalid UUIDs found in categoryIds");
  //   }

  //   const product = new productEntity();
  //   product.name = name;
  //   product.description = description;
  //   product.price = price;
  //   product.discount = discount || 0;
  //   product.isVeg = isVeg;
  //   product.photo = photo;
  //   product.categories = categories;
  //   const productEntityRespomnse = await this.ProductRepo.save(product);

  // }

  //   return {
  //     productEntityRespomnse
  //   }
  // }


  async findAllBy(id: string, paginationDto?: PaginationDto,) {
    const { page, pageSize } = paginationDto;
    if (page && pageSize) {
      const [pagedProducts, total] = await this.userRepo.findAndCount({
        where: { categories: { user: { id } } },
        relations: ['categories'],
        skip: (page - 1) * pageSize,
        take: pageSize
      });
      return { total, pagedProducts };
    } else {
      return await this.bookRepo.find({ where: { categories: { user: { id } } }, relations: ['categories'] },);
    }

  }

  // async findAll(id: string) {
  //   return await this.ProductRepo.find({
  //     where: { categories: { restaurant: { id } } },
  //     relations: ['categories', 'productAddons'],
  //     select: { categories: { id: true }, productAddons: { id: true, name: true, price: true } },
  //   });
  // }

  // async findAllByCategory(id: string, paginationDto?: PaginationDto,) {
  //   const { page, pageSize } = paginationDto;
  //   if (page && pageSize) {
  //     const [pagedProducts, total] = await this.ProductRepo.findAndCount({
  //       where: { categories: { id } },
  //       relations: ['categories', 'productAddons'],
  //       skip: (page - 1) * pageSize,
  //       take: pageSize
  //     });
  //     return { total, pagedProducts };
  //   } else {
  //     return await this.ProductRepo.find({ where: { categories: { id } }, relations: ['categories', 'productAddons'] },);
  //   }

  // }



  // async findOne(id: string) {
  //   return await this.ProductRepo.findOne({
  //     where: { id }
  //     , relations: ['productAddons']
  //   });
  // }


  // async update(id: string, updateProductDto: UpdateProductDto) {
  //   const product = await this.ProductRepo.findOne({ where: { id: id } });
  //   const updatedProduct = Object.assign(product, updateProductDto);
  //   const response = await this.ProductRepo.save(updatedProduct);
  //   return { ...response }
  // }

  // async updatePhoto(id: string, photo: string) {
  //   const product = await this.ProductRepo.findOne({ where: { id: id } });
  //   product.photo = photo;
  //   return await this.ProductRepo.save(product);
  // }

  // async updateAddon(id: string, updateAddonDto: UpdateAddonDto) {
  //   const product = await this.productAddonRepo.findOne({ where: { id: id } });
  //   const updatedProduct = Object.assign(product, updateAddonDto);
  //   return this.productAddonRepo.save(updatedProduct);
  // }

  // async remove(id: string) {
  //   const product = await this.ProductRepo.findOne({ where: { id: id } });
  //   if (!product) {
  //     throw new NotFoundException(`Addon with id ${id} not found`);
  //   }
  //   return await this.ProductRepo.remove(product);
  // }


}
