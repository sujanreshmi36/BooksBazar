import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { categoryEntity } from "./category.entity";
import { orderItemEntity } from "./order_item.entity";
import { BookConditon } from "src/helper/types/index.type";

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
    conditon: BookConditon;

    @Column({ default: null })
    photo: string;

    @Column()
    price: number;

    @ManyToMany(() => categoryEntity, (category) => category.books)
    @JoinTable({ name: 'category_bookId' })
    categories: categoryEntity[];

    @OneToMany(() => orderItemEntity, (order) => order.books)
    orderItem: orderItemEntity[];
}