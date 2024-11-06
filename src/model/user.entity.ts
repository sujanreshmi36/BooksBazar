import { Column, Entity, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { roleType } from "src/helper/types/index.type";
import { categoryEntity } from "./category.entity";

@Entity('User')
export class userEntity extends parentEntity {
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    role: roleType;

    @OneToMany(() => categoryEntity, (category) => category.user)
    categories: categoryEntity[];

}