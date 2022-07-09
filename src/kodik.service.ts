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
		.then((data) => {
			if (data.data.results) {
				return data.data.results;
			}

			return data.data;
		})
		.catch((error) => console.log(error));
};

const simplePostRequest = (endpoint, params = {}, customSettings = {}): [] => {
	return clientGvi
		.postForm(endpoint, { ...params, ...customSettings })
		.then((data) => {
			return data.data;
		})
		.catch((error) => console.log(error));
};

function paramsToObject(entries) {
	const result = {};
	for (const [key, value] of entries) { // each 'entry' is a [key, value] tupple
		result[key] = value;
	}
	return result;
}

interface ISearch {
	title?: string;
	shikimori_id?: string;
	translation_id?: string;
	with_material_data?: boolean;
	with_episodes?: boolean;
}

@Injectable()
export class KodikService {
	async search(params: ISearch): Promise<[]> {
		return simpleGetRequest('/search', params);
	}

	async linkList(name: ISearch): Promise<{}> {
		const data = await this.search(name);

		const group = {};
		for (const elem of data) {
			const shikimoriId = elem['shikimori_id'];

			if (group[shikimoriId]) {
				continue;
			}

			// @ts-ignore
			group[shikimoriId] = elem;
		}

		return group;
	}

	parseLink(link: string) {
		const params = link.split('/');
		const type = params[3];
		const id = params[4];
		const hash = params[5];

		return { type, id, hash };
	}

	async translationList({ shikimori_id }: ISearch) {
		const data = await this.search({ shikimori_id });

		data.map(e => {
			// @ts-ignore
			e['props'] = this.parseLink(e['link']);
			return e;
		});

		return data;
	}

	private async getHashByLink({ type, id, hash }) {
		const data = await simpleGetRequest(`/${type}/${id}/${hash}/720p`, {}, { baseURL: 'http://aniqit.com' });

		// @ts-ignore
		const [,type2] = data.match(/videoInfo.type = '(.*?)'/);
		// @ts-ignore
		const [,id2] = data.match(/videoInfo.id = '(.*?)'/);
		// @ts-ignore
		const [,hash2] = data.match(/videoInfo.hash = '(.*?)'/);

 		return { type: type2, hash:hash2, id: id2 }
	}

	async translationQuality({ type, id, hash }) {
		const propBy720 = await this.getHashByLink({ type, id, hash });
		const qualityList = await this.gviLinksQuality(propBy720);

		return qualityList;
	}

	async gviLinksQuality(prop) {
		const data: Array<{}> = await simplePostRequest('/gvi', prop);
		const quality = Object.keys(data['links']);

		return quality;
	}

	async episodesList({ shikimori_id,translation_id,with_episodes }: ISearch) {
		const data = await this.search({ shikimori_id,translation_id,with_episodes });
		// @ts-ignore
		const list = data[0]['seasons'][1]['episodes'];
		return list;
	}

	async gviLinksSrc({ type, id, hash, quality }) {
		const data: Array<{}> = await simplePostRequest('/gvi', { type, id, hash });
		const links = data['links'];
		const keyMaxQuality = Object.keys(links).at(-1);
		const srcHash = links[quality][0].src;
		const src = this.deCodeLink(srcHash);
		const mp4 = src.split(':hls');
		return mp4[0];
	}

	private deCodeLink(src) {
		const srcReverse = src.split('').reverse().join('');
		return Buffer.from(srcReverse, 'base64').toString();
	}
}

