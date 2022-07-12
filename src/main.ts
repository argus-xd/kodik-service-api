import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import Config from './config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors();

	const config = new DocumentBuilder()
		.setTitle('Kodik API')
		.setDescription('The Kodik API description')
		.setVersion('1.0')
		.addTag('Kodik Tag')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	console.log(Config.restPort)
	await app.listen(Config.restPort);
}

bootstrap();