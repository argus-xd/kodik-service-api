import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KodikController } from './kodik.controller';
import { AppService } from './app.service';

@Module({
	imports: [],
	controllers: [AppController, KodikController],
	providers: [AppService],
})
export class AppModule {
}
