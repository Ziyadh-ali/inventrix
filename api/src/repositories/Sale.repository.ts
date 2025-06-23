import { injectable } from "tsyringe";
import { BaseRepository } from "./Base.repository";
import { SaleDocument, SaleModel } from "../models/Sale.model";
import { ISaleRepository } from "../interfaces/ISaleRepository";
import { ISale } from "../types/Sale.interface";

@injectable()
export class SaleRepository extends BaseRepository<SaleDocument> implements ISaleRepository {
    constructor() {
        super(SaleModel)
    }

    async getCustomerLedger(customerName: string): Promise<{ date: Date; type: "Sale"; amount: number; }[]> {
        const sales = await SaleModel.find({ customerName });

        const saleEntries = sales.map((sale) => ({
            date: sale.date,
            type: "Sale" as const,
            amount: sale.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }));

        return saleEntries;
    }
    async findSalesByDateRange(from: Date, to: Date): Promise<ISale[]> {
        console.log("Repo Query Dates:", from, to);
        const sales = await SaleModel.find({
            date: { $gte: from, $lte: to }
        }).lean();
        return sales as ISale[];
    }

    async getFilteredSales(from: string, to: string, customer?: string): Promise<ISale[]> {
        const query: any = {
            date: {
                $gte: new Date(from),
                $lte: new Date(to),
            },
        };

        if (customer) {
            query.customerName = customer;
        }

        const sales = await SaleModel.find(query);
        return sales;
    }
}