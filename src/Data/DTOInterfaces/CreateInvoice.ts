export interface invoiceCreationDTO {
    companyId: number,
    startDate: string,
    endDate: string,
    includeResidualShifts: boolean | null
}