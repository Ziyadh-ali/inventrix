import { ISale } from "../types/Sale.interface";

export interface ISaleRepository {
    findSalesByDateRange(from: Date, to: Date): Promise<ISale[]>;

    getCustomerLedger(customerName: string): Promise<{
        date: Date;
        type: "Sale";
        amount: number;
    }[]>;

    getFilteredSales(from: string, to: string, customer?: string): Promise<ISale[]>
}