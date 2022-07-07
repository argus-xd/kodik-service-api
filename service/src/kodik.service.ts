import { Injectable } from '@nestjs/common';
import config from './config';
import { promises } from 'dns';

const client = require('axios').create({
	baseURL: config.clients.kodik.url,
});

const simpleGetRequest = (endpoint, params = {}): object => {
	return client
		.get(endpoint, { params: { token: config.clients.kodik.authToken, ...params } })
		.then(({ data }) => data.results)
		.catch(() => []);
};

@Injectable()
export class KodikService {
	async serach(params: string): Promise<object> {
		const paramss = {
			'id': 'movie-452654',
			'type': 'foreign-movie',
		};
		// const searchParamsString = new URLSearchParams({
		//
		// }).toString();

		const search = await simpleGetRequest('/search', params);

		return search;
	}
}
