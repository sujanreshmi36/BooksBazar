import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { parentEntity } from ".";
import { userEntity } from "./user.entity";
import { bookEntity } from "./book.entity";

@Entity('Category')
export class categoryEntity extends parentEntity {
    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => userEntity, (user) => user.categories)
    user: userEntity;

    @ManyToMany(() => bookEntity, (books) => books.categories)
    books: bookEntity[];

}