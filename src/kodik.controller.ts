import {Controller, Get, Query} from '@nestjs/common';
import {KodikService} from './kodik.service';
import {ApiTags} from '@nestjs/swagger'; 

@ApiTags('Kodik')  // <---- Отдельная секция в Swagger для всех методов контроллера
@Controller('kodik')
export class KodikController {
    private kodikService: KodikService;

    constructor() {
        this.kodikService = new KodikService();
    }

    @Get('search')
    async search(@Query('title') title: string): Promise<string> {
        const data = await this.kodikService.search({'title': title});

        return JSON.stringify(data);
    }

    @Get('linkList')
    async linkList(@Query('title') title: string): Promise<string> {
        const data = await this.kodikService.linkList({'title': title});

        return JSON.stringify(data);
    }
}