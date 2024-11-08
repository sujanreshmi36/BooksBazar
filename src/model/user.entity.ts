import { Column, Entity, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { roleType } from "src/helper/types/index.type";
import { categoryEntity } from "./category.entity";
import { orderEntity } from "./order.entity";

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



    @OneToMany(() => orderEntity, (order) => order.user)
    orders: orderEntity[];

}