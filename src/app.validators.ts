export class CsvValidator{
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
}