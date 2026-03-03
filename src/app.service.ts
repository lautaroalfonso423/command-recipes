import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CommandDto } from './dto/command.dto';
import { TagDto } from './dto/tags.dto';
import { Command } from './db/command.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tags } from './db/tangs.entitiy';
import { exec, spawn} from 'child_process';
import { promisify } from 'util';
import { Language } from './language.enum';

const execPromise = promisify(exec)




@Injectable()
export class AppService {
  
 
  constructor(
    @InjectRepository(Command)
    private readonly repoCommand: Repository< Command>,  
    @InjectRepository(Tags)
    private readonly repoTags: Repository<Tags>
  ){}


  async run(id: string) {

    const data = await this.repoCommand.findOne({
      where: {id: id}
    })

    if(!id) throw new BadRequestException("No existe.")

    const shellArg = {
      "powershell.exe": ["-Command"],
      "bash.exe": ["-c"],
      "cmd.exe": ["/c"] 
    }

    let shellToUse = "cmd.exe"

    if(data?.language === Language.POWERSHELL){
      shellToUse = "powershell.exe"
    } else if (data?.language === Language.BASH) {
      shellToUse = "bash.exe"
    }

    const commandoPermitido = ['dir', 'ls', 'ping', 'echo', 'git']

    const esValido = commandoPermitido.some(prev => data?.snippet.trim().startsWith(prev))
      
    if(!esValido){
        throw new ForbiddenException(`Comando '${data?.snippet}' no autorizado por seguridad.`);
    }

    if(/[&|;]/.test(String(data?.snippet))) throw new ForbiddenException("No se permiten operadores de encadenamiento (&, |, ;)");

   
    return new Promise((resolve, reject)=>{

      const arg = [...(shellArg[shellToUse] || ["/c"]), (String(data?.snippet))]

      const validacionSpawn = spawn(shellToUse, arg)

    let output = "";
    let errorOutput = "";

    validacionSpawn.stdout.on('data', (data) => {
      output += data.toString(); 
      console.log(`stdout: ${data}`);
    });

    validacionSpawn.stderr.on('data', (data) => {
      errorOutput += data.toString()
      console.error(`stderr: ${data}`);
    });

    validacionSpawn.on("error", (err)=>{
      reject(`Error al iniciar: ${err.message}`);
    })

    validacionSpawn.on('close', (code) => {
      if(code === 0){
        resolve({
          succes: true,
          output: output || errorOutput
        })
      }else{
        reject(`El proceso terminó con código ${code}. Error: ${errorOutput}`);
      }
    });
    })


    // try {
    //   const {stdout, stderr} = await execPromise(String(data?.snippet), {shell: shellToUse})
      
    //   return{
    //       exec_with: shellToUse,
    //       output: stdout || stderr
    //     }

    // } catch (error) {
    //   return { success: false, error: error.message };
    // }
    
      
  }

  async buscador(tag: string) {
    return this.repoCommand
    .createQueryBuilder("c")
    .leftJoinAndSelect("c.tag", "t")
    .where("t.tag ILIKE :q", {q: `%${tag}%`})
    .getMany()
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
