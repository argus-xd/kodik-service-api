import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getHello(): string {
		 return `
		<video width='320' height='240' controls>
		  <source src='//cloud.kodik-storage.com/useruploads/c526e47b-3360-4a6d-a4dc-60e9154ba651/0bd931760359a5ac6635bf36b6d299c1:2022071200/720.mp4'>
		</video>
		
		<iframe src="//aniqit.com/serial/8293/87b2b1ee8663176c299bb3602014f4b0/720p" width="610" height="370" frameborder="0" allowfullscreen allow="autoplay *; fullscreen *"></iframe>`;
	}
}