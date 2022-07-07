import { Controller, Get, Query } from '@nestjs/common';
import { KodikService } from './kodik.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Kodik')  // <---- Отдельная секция в Swagger для всех методов контроллера
@Controller('kodik')
export class KodikController {

	constructor(private readonly kodikService: KodikService) {
	}

	@Get('search')
	async search(@Query('title') title: string): string {
		const data = this.kodikService.serach(title);
		return JSON.stringify(data);
	}
}