import { Injectable } from '@nestjs/common';
import config from './config';

const client = require('axios').create({
	baseURL: config.clients.kodik.url,
});

const clientGvi = require('axios').create({
	baseURL: 'http://aniqit.com',
});

const simpleGetRequest = (endpoint, params = {}, customSettings = {}): [] => {
	return client
		.get(endpoint, { params: { token: config.clients.kodik.authToken, ...params }, ...customSettings })
		.then(({ data }) => data.results)
		.catch(() => []);
};

const simplePostRequest = (endpoint, params = {}, customSettings = {}): [] => {
	return clientGvi
		.post(endpoint, { ...params, ...customSettings })
		.then((data) => {
			console.log(data)
			return data.data
		})
		// .catch(() => []);
		.catch((error) => console.log(error));
};

interface ISearch {
	title: string,
}

@Injectable()
export class KodikService {
	async search(params: ISearch): Promise<[]> {
		return simpleGetRequest('/search', params);
	}

	async linkList(name: ISearch): Promise<{ link: any }[]> {
		// const data = await this.search(name);
		// const links = data.map((elem) => {
		// 	return {
		// 		// @ts-ignore
		// 		link: elem.link,
		// 	};
		// });

		return this.gvi();
	}

	gvi() {
		const test = {
			type: 'video',
			hash: 'd9690f09d6a0c1409fcb220c21789e0f',
			'id': 6193
		};

		return simplePostRequest('/gvi', test);
	}

	deCodeLink(src) {
		const srcReverse = src.split('').reverse().join('');
		return Buffer.from(srcReverse, 'base64').toString();
	}
}

