import { orderStatus } from "src/helper/types/index.type";
import { Entity, Column, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { orderEntity } from "./order.entity";
import { bookEntity } from "./book.entity";

@Entity('orderItem')
export class orderItemEntity extends parentEntity {
    @Column()
    quantity: number;

    @Column({ default: orderStatus.pending })
    status: orderStatus;

    @ManyToOne(() => bookEntity, (book) => book.orderItem, { onDelete: 'CASCADE' })
    books: bookEntity[];

    @ManyToOne(() => orderEntity, (order) => order.orderItem, { onDelete: 'CASCADE' })
    order: orderEntity;


}