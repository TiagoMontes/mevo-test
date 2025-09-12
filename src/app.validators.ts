export class CsvValidator{
    validateRequired(value: string): boolean {
        return !!(value && value.trim().length > 0)
    }
    
    validateCpf(cpf: string): boolean {
        if (!cpf) return false
        
        const cleanCpf = cpf.replace(/\D/g, '') // removendo tudo que nao e numero!!!
        return cleanCpf.length === 11
    }

    validateDate(dateString: string): boolean {
        if (!dateString) return false
        
        const date = new Date(dateString)
        const today = new Date()

        if (isNaN(date.getTime())) return false

        if  (date >= today) return false

        return true
    }

    validateCrm(crm: string): boolean {
        if (!crm) return false
        
        const cleanCrm = crm.replace(/\D/g, '')
        return cleanCrm.length === 6
    }

    validateUf(uf: string): boolean {
        if (!uf) return false
        
        const validUfs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
        return validUfs.includes(uf.toUpperCase())
    }

    validateDuration(duration: string): boolean {
        if (!duration) return false
        
        const durationNumber = parseInt(duration)
        return !isNaN(durationNumber) && durationNumber > 0 && durationNumber <= 90
    }
}