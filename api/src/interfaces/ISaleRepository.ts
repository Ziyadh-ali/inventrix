import { ISale } from "../types/Sale.interface";

export interface ISaleRepository {
    findSalesByDateRange(from: Date, to: Date , options : {limit : number , skip : number}): Promise<{ data: ISale[]; total: number }>;

    getCustomerLedger(customerName: string , options: { limit: number, skip: number }): Promise<{
        data: { date: Date; type: "Sale"; amount: number }[];
        total: number;
    }>;

    getFilteredSales(from: string, to: string, customer?: string): Promise<ISale[]>
}