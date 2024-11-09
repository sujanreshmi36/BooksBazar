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

  async findAllByCategory(id: string, paginationDto?: PaginationDto,) {
    const { page, pageSize } = paginationDto;
    if (page && pageSize) {
      const [pagedProducts, total] = await this.bookRepo.findAndCount({
        where: { categories: { id } },
        relations: ['categories'],
        skip: (page - 1) * pageSize,
        take: pageSize
      });
      return { total, pagedProducts };
    } else {
      return await this.bookRepo.find({ where: { categories: { id } }, relations: ['categories'] });
    }

  }




  async update(id: string, updateBookDto: UpdateBookDto) {
    const product = await this.bookRepo.findOne({ where: { id: id } });
    const updatedProduct = Object.assign(product, updateBookDto);
    const response = await this.bookRepo.save(updatedProduct);
    return { ...response }
  }

  async updatePhoto(id: string, photo: string) {
    const product = await this.bookRepo.findOne({ where: { id: id } });
    product.photo = photo;
    return await this.bookRepo.save(product);
  }



  async remove(id: string) {
    const product = await this.bookRepo.findOne({ where: { id: id } });
    if (!product) {
      throw new NotFoundException(`Addon with id ${id} not found`);
    }
    return await this.bookRepo.remove(product);
  }


}
