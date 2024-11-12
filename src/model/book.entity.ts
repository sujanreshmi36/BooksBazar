import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { parentEntity } from '.';
import { categoryEntity } from './Category.entity';
import { orderItemEntity } from './order_item.entity';
import { BookConditon, BookStatus } from 'src/helper/types/index.type';
import { viewEntity } from './view.entity';

@Entity('Book')
export class bookEntity extends parentEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  author: string;

  @Column()
  publisher: string;

  @Column()
  edition: string;

  @Column({ nullable: true })
  condition: BookConditon;

  @Column({ default: null })
  photo: string;

  @Column()
  price: number;

  @Column({ default: BookStatus.Available })
  status: BookStatus;

  @ManyToMany(() => categoryEntity, (category) => category.books)
  @JoinTable({ name: 'category_bookId' })
  categories: categoryEntity[];

  @OneToMany(() => orderItemEntity, (order) => order.book)
  orderItems: orderItemEntity[];

  @OneToMany(() => viewEntity, (view) => view.book)
  views: viewEntity[];
}
