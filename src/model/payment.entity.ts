import { paymentMethod } from "src/helper/types/index.type";
import { Entity, Column, ManyToOne, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { orderEntity } from "./order.entity";

@Entity('payment')
export class paymentEntity extends parentEntity {
    @Column()
    amount: number;

    @Column()
    method: paymentMethod;

    @Column()
    remarks: string;

    @OneToOne(() => orderEntity, (order) => order.payment)
    order: orderEntity;
}