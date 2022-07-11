import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import config from '../src/config';

describe('Kodik (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	describe('token', () => {
		it('check', async () => {
			expect(config.clients.kodik.authToken).not.toHaveLength(0);
		});
	});

	describe('search', () => {
		it('/kodik/search empty title (GET)', async () => {
			const data = await request(app.getHttpServer())
				.get('/kodik/search')
				.expect(200)
				.then(response => {
					return JSON.parse(response.text);
				});

			expect(data.status).toBe(500);
		});

		it('/kodik/search (GET)', async () => {
			const data = await request(app.getHttpServer())
				.get('/kodik/search?title=berserk')
				.expect(200)
				.then(response => {
					return JSON.parse(response.text);
				});

			expect(data).not.toHaveLength(0);
			expect(data[0]).toHaveProperty('title');
		});
	});

	describe('linkList', () => {
		it('/kodik/linkList?title=Berserk', async () => {
			const data = await request(app.getHttpServer())
				.get('/kodik/linkList?title=Berserk')
				.expect(200)
				.then(response => {
					return JSON.parse(response.text);
				});

			const result = [];
			for (const dataKey in data) {
				result.push(data[dataKey].title_orig.includes('Berserk'));
			}

			expect(result.includes(true)).toBe(true);
		});
	});

	describe('translation and quality', () => {
		it('/kodik/translation?shikimori_id=33', async () => {
			const data = await request(app.getHttpServer())
				.get('/kodik/translation?shikimori_id=33')
				.expect(200)
				.then(response => {
					return JSON.parse(response.text);
				});

			const { type, id, hash } = data[0].props;

			expect(type).not.toHaveLength(0);
			expect(id).not.toHaveLength(0);
			expect(hash).not.toHaveLength(0);

			const paramsString = new URLSearchParams(data[0].props).toString();

			const dataQuality = await request(app.getHttpServer())
				.get(`/kodik/translationQuality?${paramsString}`)
				.expect(200)
				.then(response => {
					return JSON.parse(response.text);
				});

			expect(dataQuality).not.toHaveLength(0);
		});
	});

	describe('episodesList', () => {
		it('/kodik/episodesList', async () => {
			const shikimori_id = '33';
			const data = await request(app.getHttpServer())
				.get(`/kodik/translation?shikimori_id=${shikimori_id}`)
				.expect(200)
				.then(response => {
					return JSON.parse(response.text);
				});

			const { translation } = data[0];

			const paramsString = new URLSearchParams({
				shikimori_id: shikimori_id,
				translation_id: translation.id,
				with_episodes: 'true',
			}).toString();

			const dataEpisodesList = await request(app.getHttpServer())
				.get(`/kodik/episodesList?${paramsString}`)
				.expect(200)
				.then(response => {
					return JSON.parse(response.text);
				});

			expect(Object.keys(dataEpisodesList)).not.toHaveLength(0);

			for (const elem in dataEpisodesList) {
				expect(dataEpisodesList[elem].includes('aniqit.com')).toBe(true); //TODO Сомнительный тест
			}
		});
	});

	describe('mediaLinkSource', () => {
		it('/kodik/mediaLinkSource', async () => {
			const paramsString = new URLSearchParams({
				type: 'seria',
				id: '214169',
				hash: 'af1439c08c2d43c2dc87f5764ce62268',
				quality: '720',
			}).toString();

			const data = await request(app.getHttpServer())
				.get(`/kodik/mediaLinkSource?${paramsString}`)
				.expect(200)
				.then(response => {
					return JSON.parse(response.text);
				});

			expect(data.includes('.mp4')).toBe(true);
		});
	});
});
