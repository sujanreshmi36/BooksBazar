import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { categoryEntity } from "./category.entity";
import { orderItemEntity } from "./order_item.entity";

@Entity('Book')
export class bookEntity extends parentEntity {
    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    author: string;

    @Column()
    publisher: string;

    @Column()
    edition: string;

    @Column()
    conditon: string;

    @Column({ default: null })
    photo: string;

    @ManyToMany(() => categoryEntity, (category) => category.books)
    @JoinTable({ name: 'category_bookId' })
    categories: categoryEntity[];

    @OneToMany(() => orderItemEntity, (order) => order.books)
    orderItem: orderItemEntity[];
}