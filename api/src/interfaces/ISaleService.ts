import { SaleDocument } from "../models/Sale.model";
import { ISale } from "../types/Sale.interface";

export interface ISaleService {
    create(data: ISale): Promise<SaleDocument>;
    findAll(): Promise<SaleDocument[]>;
    findById(id: string): Promise<SaleDocument | null>;
    update(id: string, data: Partial<ISale>): Promise<SaleDocument | null>;
    delete(id: string): Promise<void>;
    findPaginated(options: { limit?: number; skip?: number; sort?: any }, query?: any,): Promise<{ data: SaleDocument[] | []; total: number }>
    findSalesByDateRange(from: Date, to: Date , options: { limit: number; skip: number }): Promise<{ data: ISale[]; total: number }>;
    getCustomerLedger(customerName: string , options : {limit : number , skip : number}): Promise<{
        data: { date: Date; type: "Sale"; amount: number }[];
        total: number;
    }>;
    getFilteredSales(from: string, to: string, customer?: string): Promise<ISale[]>
}