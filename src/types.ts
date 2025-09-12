export interface csvData {
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

export interface controlledValidationData {
    message: string
    value: string
}