const restPort: number = Number(process.env.REST_PORT) || 8080;

interface IConfig {
	apiHost: string,
	restPort: number,
	clients: any, //TODO Заменить на object
}

const config: Readonly<IConfig> = {
	'apiHost': process.env.API_HOST || 'http://127.0.0.1:' + restPort,
	'restPort': 123,
	'clients': {
		kodik: {
			authToken: process.env.KODIK_AUTH_TOKEN,
			url: "https://kodikapi.com",
		}
	},
};

export default config;