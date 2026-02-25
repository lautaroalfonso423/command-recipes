import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ManyToOne } from "typeorm/browser";
import { Tags } from "./tangs.entitiy";
import { Language } from "src/language.enum";


@Entity({
    name: "commands"
})

export class Command {

    @PrimaryGeneratedColumn()
    id: string

    @Column({length: 50})
    descrption: string 
    
    @Column()
    snippet: string

    @Column({
        type: "enum",
        enum: Language,
        default: Language.POWERSHELL
    })
    language: Language.POWERSHELL

    @ManyToOne(() => Tags, e => e.commands)
    tag: Tags
}