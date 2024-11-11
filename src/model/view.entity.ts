import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { bookEntity } from "./book.entity";
import { parentEntity } from ".";
import { userEntity } from "./user.entity";

@Entity()
export class viewEntity extends parentEntity {

    @Column()
    userId: string;


    @ManyToOne(() => userEntity, user => user.views)
    user: userEntity; // Relation to User

    @ManyToOne(() => bookEntity, book => book.views)
    book: bookEntity; // Relation to Book

}