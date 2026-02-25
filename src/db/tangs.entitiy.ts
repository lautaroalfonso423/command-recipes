import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Command } from "./command.entity";


@Entity({
    name: "tags"
})

export class Tags {

    @PrimaryGeneratedColumn()
    id: string

    tag: string
    
    @OneToMany(() => Command, e => e.tag)
    commands: Command[]
}