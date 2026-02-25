import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandDto } from './dto/command.dto';
import { TagDto } from './dto/tags.dto';
import { Command } from './db/command.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tags } from './db/tangs.entitiy';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Command)
    private readonly repoCommand: Repository< Command>,  
    @InjectRepository(Tags)
    private readonly repoTags: Repository<Tags>
  ){}

  getHello(): string {
    return 'Hello World!';
  }

  async tag(body: TagDto) {

    const data = this.repoTags.create(body)
    await this.repoTags.save(data)
    return data
  }
  
  
  async command(id: string, body: CommandDto) {
    const verify = await this.repoTags.findOne({
      where: {id: id}
    })
    if(!verify?.tag || verify.tag.length === 0) throw new BadRequestException("Necesita crear un Tag para crear un comando")
    
    const data = this.repoCommand.create({
      ...body,
      tag: {id: verify.id}
    })

    await this.repoCommand.save(data)
    return data;
  }
  
}
