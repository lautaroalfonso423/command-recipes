import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tags } from "./tangs.entitiy";
import { Language } from "src/language.enum";


@Entity({
    name: "commands"
})

export class Command {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({length: 50})
    description: string 
    
    @Column()
    snippet: string

    @Column({
        type: "enum",
        enum: Language,
        default: Language.POWERSHELL
    })
    language: Language

    @ManyToOne(() => Tags, e => e.commands)
    tag: Tags
}