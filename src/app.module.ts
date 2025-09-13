import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { prescriptionValidator } from './app.validators';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, prescriptionValidator],
})
export class AppModule {}
