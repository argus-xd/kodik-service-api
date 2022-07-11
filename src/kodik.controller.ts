import { Controller, Get, Query } from '@nestjs/common';
import { KodikService } from './kodik.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Kodik')  // <---- Отдельная секция в Swagger для всех методов контроллера
@Controller('kodik')
export class KodikController {
	private kodikService: KodikService;

	constructor() {
		this.kodikService = new KodikService();
	}

	@Get('search')
	async search(@Query('title') title: string): Promise<string> {

		const data = await this.kodikService.search({ 'title': title });

		return JSON.stringify(data);
	}

	@Get('linkList')
	async linkList(@Query('title') title: string): Promise<string> {
		const data = await this.kodikService.linkList({ 'title': title, 'with_material_data': true });

		return JSON.stringify(data);
	}

	@Get('translation')
	async translation(@Query('shikimori_id') shikimori_id: string): Promise<string> {
		const translationList = await this.kodikService.translationList({ shikimori_id });

		return JSON.stringify(translationList);
	}

	@Get('translationQuality')
	async translationQuality(
		@Query('type') type: string,
		@Query('id') id: string,
		@Query('hash') hash: string,
	): Promise<string> {
		const translationList = await this.kodikService.translationQuality({ type, id, hash });

		return JSON.stringify(translationList);
	}

	@Get('episodesList')
	async episodesList(
		@Query('shikimori_id') shikimori_id: string,
		@Query('translation_id') translation_id: string,
		@Query('with_episodes') with_episodes: boolean,
	): Promise<string> {
		const episodesList = await this.kodikService.episodesList({ shikimori_id, translation_id, with_episodes });

		return JSON.stringify(episodesList);
	}

	@Get('mediaLinkSource')
	async getSrc(
		@Query('type') type: string,
		@Query('id') id: string,
		@Query('hash') hash: string,
		@Query('quality') quality: string,
	): Promise<string> {
		const episodesList = await this.kodikService.gviLinksSrc({ type, id, hash, quality });

		return JSON.stringify(episodesList);
	}

	@Get('fullMedia')
	async fullMedia(
		@Query('shikimori_id') shikimori_id: string,
		@Query('translation_id') translation_id: string,
		@Query('episode') episode: string,
		@Query('quality') quality: string,
	): Promise<string> {
		const episodesList = await this.kodikService.fullMedia({ shikimori_id, translation_id, episode, quality });

		return JSON.stringify(episodesList);
	}
}