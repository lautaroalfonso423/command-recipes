import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CommandDto } from './dto/command.dto';
import { TagDto } from './dto/tags.dto';
import { ParamsTokenFactory } from '@nestjs/core/pipes';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(){
    
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

}
