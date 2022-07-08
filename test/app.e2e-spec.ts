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

			expect(data).toHaveLength(0);
		});

		it('/kodik/search (GET)', async () => {
			const data = await request(app.getHttpServer())
				.get('/kodik/search?title=naruto')
				.expect(200)
				.then(response => {
					return JSON.parse(response.text);
				});

			expect(data).not.toHaveLength(0);
			expect(data[0]).toHaveProperty('title');
		});
	});
});
