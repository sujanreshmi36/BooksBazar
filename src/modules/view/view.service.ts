import { Injectable } from '@nestjs/common';
import { CreateViewDto } from './dto/create-view.dto';
import { UpdateViewDto } from './dto/update-view.dto';
import { viewEntity } from 'src/model/view.entity';
import { bookEntity } from 'src/model/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ViewService {
  constructor(
    @InjectRepository(viewEntity)
    private viewsRepository: Repository<viewEntity>,
    @InjectRepository(bookEntity)
    private booksRepository: Repository<bookEntity>,
  ) { }
  async recordView(userId: string, bookId: string) {
    const book = await this.booksRepository.findOne({ where: { id: bookId } });
    if (!book) throw new Error('Book not found');

    const view = this.viewsRepository.create({ userId, book });
    await this.viewsRepository.save(view);
  }

  async getViewedBooks(userId: string): Promise<bookEntity[]> {
    const views = await this.viewsRepository.find({
      where: { userId },
      relations: ['book'],
    });

    // Extract unique books from view records
    const viewedBooks = views.map(view => view.book);
    const uniqueBooks = Array.from(new Set(viewedBooks.map(book => book.id)))
      .map(id => viewedBooks.find(book => book.id === id));

    return uniqueBooks;
  }

  findAll() {
    return `This action returns all view`;
  }

  findOne(id: number) {
    return `This action returns a #${id} view`;
  }

  update(id: number, updateViewDto: UpdateViewDto) {
    return `This action updates a #${id} view`;
  }

  remove(id: number) {
    return `This action removes a #${id} view`;
  }
}
