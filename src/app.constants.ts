export const VALIDATION_LIMITS = {
    CPF_LENGTH: 11,
    CRM_LENGTH: 6,
    MAX_DURATION_DAYS: 90,
    MIN_DURATION_DAYS: 1,
    MAX_CONTROLLED_DURATION_DAYS: 60
}

export const ERROR_MESSAGE = {
    REQUIRED_ID: 'ID é obrigatório',
    DUPLICATE_ID: 'ID da prescrição deve ser único',
    INVALID_CPF: 'CPF deve ter 11 dígitos válidos',
    INVALID_CRM: 'CRM deve ter 6 dígitos',
    INVALID_UF: 'UF inválida',
    INVALID_DURATION: 'Duração deve ser entre 1 e 90 dias',
    INVALID_FREQUENCY: 'Frequência deve estar no formato correto (ex: 8/8h, 12/12h, se necessário e etc.)',
    INVALID_DOSAGE: 'Dosagem deve conter valor e unidade (ex: 500mg, 10ml, 2cp)',
    INVALID_DATE: 'Data inválida ou futura',
    REQUIRED_MEDICATION: 'Medicamento é obrigatório',
    EMPTY_CSV: 'Arquivo CSV vazio',
    UPLOAD_NOT_FOUND: 'Upload não encontrado',
}

export const BRAZILIAN_STATES = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']