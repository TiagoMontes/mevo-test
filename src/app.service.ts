import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from "csv-parse/sync";
import { csvData } from './types';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  parseCsvData(csvBufferData: Buffer) {
    return parse(csvBufferData, {
      columns: true,           
      skip_empty_lines: true,
    })
  }

  formatCsvData(csvBufferData: Buffer) {
    const data: csvData[] = parse(csvBufferData, {
      columns: true,           
      skip_empty_lines: true,
    })

    if(!data.length) {
      throw new BadRequestException('CSV vazio')
    }

    return {
      upload_id: "temp-id-123",
      status: "processing",
      total_records: data.length
    }
  }

  validateAllCsvInformations(data) {
    console.log(data)
  }

  findKeysFromObject(data: csvData[]) {
    return Object.keys(data[0])
  }
}
