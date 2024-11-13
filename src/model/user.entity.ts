import { Column, Entity, OneToMany } from 'typeorm';
import { parentEntity } from '.';
import { roleType } from 'src/helper/types/index.type';
import { categoryEntity } from './Category.entity';
import { orderEntity } from './order.entity';
import { viewEntity } from './view.entity';
import { bookEntity } from './book.entity';

@Entity('User')
export class userEntity extends parentEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: roleType.customer })
  role: roleType;

  @Column({ default: null })
  rToken: string;

  @OneToMany(() => categoryEntity, (category) => category.user)
  categories: categoryEntity[];

  @OneToMany(() => orderEntity, (order) => order.user)
  orders: orderEntity[];

  @OneToMany(() => viewEntity, (view) => view.user)
  views: viewEntity[];

  @OneToMany(() => bookEntity, (book) => book.user)
  books: bookEntity[];
}
