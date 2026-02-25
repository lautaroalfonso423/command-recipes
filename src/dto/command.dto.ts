import { IsString } from "class-validator"



export class CommandDto {


        @IsString()
        snippet: string

        @IsString()
        description: string 
}