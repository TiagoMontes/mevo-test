import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from "csv-parse/sync";
import { PrescriptionRecord, UploadStatus } from './types';
import { prescriptionValidator } from './app.validators';
import { v4 as uuidv4 } from 'uuid';
import { ERROR_MESSAGE } from './app.constants';

@Injectable()
export class AppService {
  constructor(private readonly prescriptionValidator: prescriptionValidator) {}

  private uploadRepository = new Map<string, UploadStatus>()

  parseCsvToRecords(csvBufferData: Buffer) {
    try {
      const result = parse(csvBufferData, {
        columns: true,
        skip_empty_lines: true,
      })

      return result as PrescriptionRecord[]
    } catch (error) {
      console.error(error)
      throw new BadRequestException(ERROR_MESSAGE.INVALID_FILE_FORMAT)
    }
  }

  processPrescriptionUpload(csvBufferData: Buffer): UploadStatus {
    const uploadId = uuidv4()

    const initialStatus: UploadStatus = {
      upload_id: uploadId,
      status: "processing",
      total_records: 0,
      processed_records: 0,
      valid_records: 0,
      errors: []
    }

    this.uploadRepository.set(uploadId, initialStatus)

    setImmediate(() => {
      this.processInBackground(uploadId, csvBufferData)
    })

    return initialStatus
  }

  private async processInBackground(uploadId: string, csvBufferData: Buffer) {
    try {
      const Records: PrescriptionRecord[] = this.parseCsvToRecords(csvBufferData)
      this.prescriptionValidator.validateCsvStructure(Records)

      this.uploadRepository.set(uploadId, {
        upload_id: uploadId,
        status: "processing",
        total_records: Records.length,
        processed_records: 0,
        valid_records: 0,
        errors: []
      })

      this.processValidationAsync(Records, uploadId)
    } catch (error) {
      console.error(error)
      this.uploadRepository.set(uploadId, {
        upload_id: uploadId,
        status: "failed",
        total_records: 0,
        processed_records: 0,
        valid_records: 0,
        errors: [{
          line: 0,
          field: "file",
          message: ERROR_MESSAGE.PROCESSING_ERROR,
          value: ""
        }]
      })
    }
  }

  processValidation(Records: PrescriptionRecord[]) {

    const uploadId = uuidv4()
    return this.processValidationSync(Records, uploadId)
  }

  processValidationAsync(Records: PrescriptionRecord[], uploadId: string) {
    let processedCount = 0
    let validRecords = 0
    const errors: Array<{line: number, field: string, message: string, value: string}> = []
    const usedIds = new Set<string>()

    const processNextBatch = () => {
      const batchSize = 10
      const startIndex = processedCount
      const endIndex = Math.min(startIndex + batchSize, Records.length)

      for (let i = startIndex; i < endIndex; i++) {
        const row = Records[i]
        const lineNumber = i + 2
        let rowIsValid = true

        const controlledValidation = this.prescriptionValidator.validateControlledMedication(
          row.controlled,
          row.notes,
          row.duration
        )

        if (!this.prescriptionValidator.hasValue(row.id)) {
          rowIsValid = false
          errors.push({
            line: lineNumber,
            field: "id",
            message: ERROR_MESSAGE.REQUIRED_ID,
            value: row.id
          })
        } else if (usedIds.has(row.id)) {
          rowIsValid = false
          errors.push({
            line: lineNumber,
            field: "id",
            message: ERROR_MESSAGE.DUPLICATE_ID,
            value: row.id
          })
        } else {
          usedIds.add(row.id)
        }

        if (!this.prescriptionValidator.hasValue(row.medication)) {
          rowIsValid = false
          errors.push({
            line: lineNumber,
            field: "medication",
            message: ERROR_MESSAGE.REQUIRED_MEDICATION,
            value: row.medication
          })
        }

        if (!this.prescriptionValidator.validateCpf(row.patient_cpf)) {
          rowIsValid = false
          errors.push({
            line: lineNumber,
            field: "patient_cpf",
            message: ERROR_MESSAGE.INVALID_CPF,
            value: row.patient_cpf
          })
        }

        if (!this.prescriptionValidator.validateDate(row.date)) {
          rowIsValid = false
          errors.push({
            line: lineNumber,
            field: "date",
            message: ERROR_MESSAGE.INVALID_DATE,
            value: row.date
          })
        }

        if (!this.prescriptionValidator.validateCrm(row.doctor_crm)) {
          rowIsValid = false
          errors.push({
            line: lineNumber,
            field: "doctor_crm",
            message: ERROR_MESSAGE.INVALID_CRM,
            value: row.doctor_crm
          })
        }

        if (!this.prescriptionValidator.validateUf(row.doctor_uf)) {
          rowIsValid = false
          errors.push({
            line: lineNumber,
            field: "doctor_uf",
            message: ERROR_MESSAGE.INVALID_UF,
            value: row.doctor_uf
          })
        }

        if (!this.prescriptionValidator.validateDuration(row.duration)) {
          rowIsValid = false
          errors.push({
            line: lineNumber,
            field: "duration",
            message: ERROR_MESSAGE.INVALID_DURATION,
            value: row.duration
          })
        }

        if (!this.prescriptionValidator.validateFrequency(row.frequency)) {
          rowIsValid = false
          errors.push({
            line: lineNumber,
            field: "frequency",
            message: ERROR_MESSAGE.INVALID_FREQUENCY,
            value: row.frequency
          })
        }

        if (!this.prescriptionValidator.validateDosage(row.dosage)) {
          rowIsValid = false
          errors.push({
            line: lineNumber,
            field: "dosage",
            message: ERROR_MESSAGE.INVALID_DOSAGE,
            value: row.dosage
          })
        }

        if (!controlledValidation.isValid) {
          rowIsValid = false
          controlledValidation.errors.forEach(error => {
            errors.push({
              line: lineNumber,
              field: "controlled",
              message: error.message,
              value: error.value
            })
          })
        }

        if (rowIsValid) {
          validRecords++
        }

        processedCount++
      }

      this.uploadRepository.set(uploadId, {
        upload_id: uploadId,
        status: processedCount < Records.length ? "processing" : "completed",
        total_records: Records.length,
        processed_records: processedCount,
        valid_records: validRecords,
        errors: errors
      })

      if (processedCount < Records.length) {
        setTimeout(processNextBatch, 2000)
      }
    }

    processNextBatch()
  }

  processValidationSync(Records: PrescriptionRecord[], uploadId: string) {
    let validRecords = 0
    const errors: Array<{line: number, field: string, message: string, value: string}> = []
    const usedIds = new Set<string>()

    Records.forEach((row, index) => {
      const lineNumber = index + 2
      let rowIsValid = true

      const controlledValidation = this.prescriptionValidator.validateControlledMedication(
        row.controlled, 
        row.notes, 
        row.duration
      )

      if (!this.prescriptionValidator.hasValue(row.id)) {
        rowIsValid = false
        errors.push({
          line: lineNumber,
          field: "id",
          message: ERROR_MESSAGE.REQUIRED_ID,
          value: row.id || ""
        })
      } else if (usedIds.has(row.id)) {
        rowIsValid = false
        errors.push({
          line: lineNumber,
          field: "id",
          message: ERROR_MESSAGE.DUPLICATE_ID,
          value: row.id || ""
        })
      } else {
        usedIds.add(row.id) 
      }

      if (!this.prescriptionValidator.hasValue(row.medication)) {
        rowIsValid = false
        errors.push({
          line: lineNumber,
          field: "medication",
          message: ERROR_MESSAGE.REQUIRED_MEDICATION,
          value: row.medication || ""
        })
      }
      
      if (!this.prescriptionValidator.validateCpf(row.patient_cpf)) {
        rowIsValid = false
        errors.push({
          line: lineNumber,
          field: "patient_cpf",
          message: ERROR_MESSAGE.INVALID_CPF,
          value: row.patient_cpf || ""
        })
      }

      if (!this.prescriptionValidator.validateDate(row.date)) {
        rowIsValid = false 
        errors.push({
          line: lineNumber,
          field: "date",
          message: ERROR_MESSAGE.INVALID_DATE,
          value: row.date || ""
        })
      }

      if (!this.prescriptionValidator.validateCrm(row.doctor_crm)) {
        rowIsValid = false
        errors.push({
          line: lineNumber,
          field: "doctor_crm",
          message: ERROR_MESSAGE.INVALID_CRM,
          value: row.doctor_crm || ""
        })
      }

      if (!this.prescriptionValidator.validateUf(row.doctor_uf)) {
        rowIsValid = false
        errors.push({
          line: lineNumber,
          field: "doctor_uf",
          message: ERROR_MESSAGE.INVALID_UF,
          value: row.doctor_uf || ""
        })
      }

      if (!this.prescriptionValidator.validateDuration(row.duration)) {
        rowIsValid = false
        errors.push({
          line: lineNumber,
          field: "duration",
          message: ERROR_MESSAGE.INVALID_DURATION,
          value: row.duration || ""
        })
      }

      if (!this.prescriptionValidator.validateFrequency(row.frequency)) {
        rowIsValid = false
        errors.push({
          line: lineNumber,
          field: "frequency",
          message: ERROR_MESSAGE.INVALID_FREQUENCY,
          value: row.frequency || ""
        })
      }

      if (!this.prescriptionValidator.validateDosage(row.dosage)) {
        rowIsValid = false
        errors.push({
          line: lineNumber,
          field: "dosage",
          message: ERROR_MESSAGE.INVALID_DOSAGE,
          value: row.dosage || ""
        })
      }

      if (!controlledValidation.isValid) {
        rowIsValid = false
        controlledValidation.errors.forEach(error => {
          errors.push({
            line: lineNumber,
            field: "controlled",
            message: error.message,
            value: error.value || ""
          })
        })
      }

      if (rowIsValid) {
        validRecords++
      }
    })

    const result: UploadStatus = {
      upload_id: uploadId,
      status: "completed",
      total_records: Records.length,
      processed_records: Records.length,
      valid_records: validRecords,
      errors: errors
    }

    this.uploadRepository.set(uploadId, result)

    return result
  }

  retrieveUploadStatus(uploadId: string): UploadStatus {
    const result = this.uploadRepository.get(uploadId)
    
    if (!result) {
      throw new BadRequestException(ERROR_MESSAGE.UPLOAD_NOT_FOUND)
    }
    
    return result
  }
}
