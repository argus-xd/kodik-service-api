import { Module } from '@nestjs/common';
import { KodikController } from './kodik.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'client'),
		}),
	],
	controllers: [AppController, KodikController],
	providers: [AppService],
})
export class AppModule {
}
