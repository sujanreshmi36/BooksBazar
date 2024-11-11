import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { bookEntity } from 'src/model/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { categoryEntity } from 'src/model/Category.entity';
import { userEntity } from 'src/model/user.entity';
import { ILike, In, Like, Repository } from 'typeorm';
import { PaginationDto } from 'src/helper/utils/pagination.dto';
import { viewEntity } from 'src/model/view.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(bookEntity)
    private bookRepo: Repository<bookEntity>,
    @InjectRepository(categoryEntity)
    private categoryRepo: Repository<categoryEntity>,
    @InjectRepository(viewEntity)
    private viewRepository: Repository<viewEntity>,
    @InjectRepository(userEntity)
    private userRepo: Repository<userEntity>,
  ) { }
  async create(sellerId: string, createBookDto: CreateBookDto, photo: string) {
    const {
      title,
      description,
      price,
      condition,
      publisher,
      author,
      edition,
      categoryIds,
    } = createBookDto;

    // Fetch categories based on provided category IDs and verify them
    const categories = await this.categoryRepo.find({
      where: { id: In(categoryIds) },
    });

    if (categories.length !== categoryIds.length) {
      throw new BadRequestException('Some category IDs are invalid');
    }

    // Check if the seller exists
    const seller = await this.userRepo.findOne({ where: { id: sellerId } });
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    const book = new bookEntity();
    book.author = author;
    book.categories = categories;
    book.condition = condition;
    book.description = description;
    book.edition = edition;
    book.photo = photo;
    book.price = price;
    book.publisher = publisher;
    book.title = title;

    const savedBook = await this.bookRepo.save(book);

    return {
      message: 'Book added successfully.',
      data: savedBook,
    };
  }

  async findOne(id: string) {
    const book = await this.bookRepo.findOne({ where: { id } });
    if (!book) {
      throw new BadRequestException('Book not found');
    }
    return book;
  }

  async findAllBy(id: string, paginationDto?: PaginationDto) {
    const { page, pageSize } = paginationDto;
    if (page && pageSize) {
      const [pagedProducts, total] = await this.userRepo.findAndCount({
        where: { categories: { user: { id } } },
        relations: ['categories'],
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      return { total, pagedProducts };
    } else {
      return await this.bookRepo.find({
        where: { categories: { user: { id } } },
        relations: ['categories'],
      });
    }
  }

  async findAll(paginationDto?: PaginationDto) {
    const { page, pageSize } = paginationDto;
    if (page && pageSize) {
      const [pagedProducts, total] = await this.userRepo.findAndCount({
        relations: ['categories'],
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      return { total, pagedProducts };
    } else {
      return await this.bookRepo.find({
        relations: ['categories'],
      });
    }
  }

  async findAllByCategory(id: string, paginationDto?: PaginationDto) {
    const { page, pageSize } = paginationDto;
    if (page && pageSize) {
      const [pagedProducts, total] = await this.bookRepo.findAndCount({
        where: { categories: { id } },
        relations: ['categories'],
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      return { total, pagedProducts };
    } else {
      return await this.bookRepo.find({
        where: { categories: { id } },
        relations: ['categories'],
      });
    }
  }

  async searchBooks(query: string): Promise<bookEntity[]> {
    return await this.bookRepo.find({
      where: [
        { title: ILike(`%${query}%`) },
        { author: ILike(`%${query}%`) },
      ],
    });
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const product = await this.bookRepo.findOne({ where: { id: id } });
    const updatedProduct = Object.assign(product, updateBookDto);
    const response = await this.bookRepo.save(updatedProduct);
    return { ...response };
  }

  async updatePhoto(id: string, photo: string) {
    const product = await this.bookRepo.findOne({ where: { id: id } });
    product.photo = photo;
    return await this.bookRepo.save(product);
  }

  async recommendBooks(userId: string): Promise<bookEntity[]> {
    // Get the books the user has viewed
    const userViews = await this.viewRepository.find({
      where: { userId },
      relations: ['book', 'book.categories'],
    });

    const viewedBooks = userViews.map((view) => view.book);

    // If no books are viewed, return an empty array
    if (viewedBooks.length === 0) {
      return [];
    }

    // Collect attributes of viewed books
    const categoryIds = new Set<string>();
    const authors = new Set<string>();

    viewedBooks.forEach((book) => {
      if (book.categories) {
        // Collect category IDs from viewed books, check if categories exist
        book.categories.forEach((category) => categoryIds.add(category.id));
      }

      if (book.author) {
        authors.add(book.author);
      }
    });

    // Query books using queryBuilder
    const queryBuilder = this.bookRepo
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.categories', 'category')
      .where('category.id IN (:...categoryIds)', {
        categoryIds: Array.from(categoryIds),
      })
      .orWhere('book.author IN (:...authors)', { authors: Array.from(authors) })
      .take(10); // Limit to 10 recommendations

    const recommendedBooks = await queryBuilder.getMany();

    // Exclude books the user has already viewed
    const viewedBookIds = new Set(viewedBooks.map((book) => book.id));
    return recommendedBooks.filter((book) => !viewedBookIds.has(book.id));
  }

  async remove(id: string) {
    const product = await this.bookRepo.findOne({ where: { id: id } });
    if (!product) {
      throw new NotFoundException(`Addon with id ${id} not found`);
    }
    return await this.bookRepo.remove(product);
  }
}
