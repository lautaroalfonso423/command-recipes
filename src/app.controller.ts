import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CommandDto } from './dto/command.dto';
import { TagDto } from './dto/tags.dto';

@Controller("command")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(
    @Query("tag") tag: string
  ){
    return this.appService.buscador(tag)
  }

  @Post()
  createTag(
    @Body() body:TagDto
  ){
    return this.appService.tag(body)
  } 

  @Post(":id")
  createCommand(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() body: CommandDto
  ){
    return this.appService.command(id, body)
  }

  @Get("run/:id")
  runCommand(
    @Param("id", new ParseUUIDPipe()) id: string
  ){
    return this.appService.run(id)
  }

}
