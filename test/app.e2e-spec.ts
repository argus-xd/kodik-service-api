import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/ (GET)', () => {
		return request(app.getHttpServer())
			.get('/')
			.expect(200)
			.expect('Hello World!');
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
