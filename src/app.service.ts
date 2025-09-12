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

    const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      upload_id: uploadId,
      status: "processing",
      total_records: data.length
    }
  }

  getUploadStatus(uploadId: string) {
    return {
      upload_id: uploadId,
      status: "completed",
      total_records: 3,
      processed_records: 3,
      valid_records: 2,
      errors: [
        {
          line: 2,
          field: "patient_cpf",
          message: "CPF inválido",
          value: "123ABC"
        }
      ]
    }
  }

  validateAllCsvInformations(data) {
    console.log(data)
  }

  findKeysFromObject(data: csvData[]) {
    return Object.keys(data[0])
  }
}
