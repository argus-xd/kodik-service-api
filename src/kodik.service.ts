import { Injectable } from '@nestjs/common';
import config from './config';

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
	async search(params: object): Promise<object> {
		return simpleGetRequest('/search', params);
	}
}
