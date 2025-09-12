import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from "csv-parse/sync";
import { csvData } from './types';
import { CsvValidator } from './app.validators';

@Injectable()
export class AppService {
  constructor(private readonly csvValidators: CsvValidator) {}

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

    let validRecords = 0
    const errors: Array<{line: number, field: string, message: string, value: string}> = []

    data.forEach((row, index) => {
      const lineNumber = index + 2
      let rowIsValid = true
      
      if (this.csvValidators.validateCpf(row.patient_cpf)) {
        rowIsValid = false
      } else {
        errors.push({
          line: lineNumber,
          field: "patient_cpf",
          message: "CPF deve ter 11 dígitos",
          value: row.patient_cpf || ""
        })
      }

      if (!this.csvValidators.validateDate(row.date)) {
        rowIsValid = false
        errors.push({
          line: lineNumber,
          field: "date",
          message: "Data inválida ou futura",
          value: row.date || ""
        })
      }

      if (!this.csvValidators.validateCrm(row.doctor_crm)) {
        rowIsValid = false
        errors.push({
          line: lineNumber,
          field: "doctor_crm",
          message: "CRM deve ter 6 digitos ",
          value: row.doctor_crm || ""
        })
      }

      if (!this.csvValidators.validateUf(row.doctor_uf)) {
        rowIsValid = false
        errors.push({
          line: lineNumber,
          field: "doctor_uf",
          message: "UF inválida",
          value: row.doctor_uf || ""
        })
      }

      if (rowIsValid) {
        validRecords++
      }
    })

    return {
      upload_id: uploadId,
      status: "completed",
      total_records: data.length,
      processed_records: data.length,
      valid_records: validRecords,
      errors: errors
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
