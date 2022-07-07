import { Module } from '@nestjs/common';
import { KodikController } from './kodik.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [],
	controllers: [AppController, KodikController],
	providers: [AppService],
})
export class AppModule {
}
