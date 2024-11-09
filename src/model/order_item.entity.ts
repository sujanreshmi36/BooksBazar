import { orderStatus } from "src/helper/types/index.type";
import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { orderEntity } from "./order.entity";
import { bookEntity } from "./book.entity";

@Entity('orderItem')
export class orderItemEntity extends parentEntity {
    @Column()
    quantity: number;

    @Column()
    price: number;

    @ManyToOne(() => bookEntity, (book) => book.orderItems, { onDelete: 'CASCADE' })
    book: bookEntity;

    @ManyToOne(() => orderEntity, (order) => order.orderItem, { onDelete: 'CASCADE' })
    order: orderEntity;
    orderItem: bookEntity;


}