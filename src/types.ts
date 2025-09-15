export interface PrescriptionRecord {
    id: string,
    date: string,
    patient_cpf: string,
    doctor_crm: string,
    doctor_uf: string,
    medication: string,
    controlled: string,
    dosage: string,
    frequency: string,
    duration: string,
    notes: string  
}

export interface ValidationError {
    message: string
    value: string
}

export interface UploadStatus {
    upload_id: string
    status: "processing" | "completed" | "failed"
    total_records: number
    processed_records: number
    valid_records: number
    errors: Array<{
        line: number
        field: string
        message: string
        value: string
    }>
}