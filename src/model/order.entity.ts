import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { parentEntity } from ".";
import { categoryEntity } from "./category.entity";
import { orderStatus, paymentMethod } from "src/helper/types/index.type";
import { userEntity } from "./user.entity";
import { orderItemEntity } from "./order_item.entity";
import { paymentEntity } from "./payment.entity";

@Entity('Order')
export class orderEntity extends parentEntity {

    @Column({ default: orderStatus.pending })
    status: orderStatus;

    @Column()
    shipping_address: string;

    @Column()
    phone: string;

    @OneToOne(() => paymentEntity, (payment) => payment.order)
    payment: paymentEntity;

    @ManyToOne(() => userEntity, (user) => user.orders)
    user: userEntity;

    @OneToMany(() => orderItemEntity, (item) => item.order)
    orderItem: orderItemEntity[];


}