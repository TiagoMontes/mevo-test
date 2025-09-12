import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('api/prescriptions/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const buffer = file.buffer
    
    const result = this.appService.validateAllCsvData(buffer)
    return result
  }

  @Get('api/prescriptions/upload/:id')
  getUploadStatus(@Param('id') id: string) {
    return this.appService.getUploadStatus(id)
  }
}
