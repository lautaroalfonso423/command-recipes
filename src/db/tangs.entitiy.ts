import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Command } from "./command.entity";


@Entity({
    name: "tags"
})

export class Tags {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    tag: string
    
    @OneToMany(() => Command, e => e.tag)
    commands: Command[]
}