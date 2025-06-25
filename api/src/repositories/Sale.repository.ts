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

    async getCustomerLedger(
        customerName: string,
        options: { limit: number; skip: number }
    ): Promise<{
        data: { date: Date; type: "Sale"; amount: number }[];
        total: number;
    }> {
        const { limit = 10, skip = 0 } = options;

        const sales = await SaleModel.find({ customerName })
            .skip(skip)
            .limit(limit);
        console.log(sales)
        const total = await SaleModel.countDocuments({ customerName });

        const data = sales.map((sale) => ({
            date: sale.date,
            type: "Sale" as const,
            amount: sale.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            ),
        }));

        return { data, total };
    }
    async findSalesByDateRange(
        from: Date,
        to: Date,
        options: { limit: number; skip: number }
    ): Promise<{ data: ISale[]; total: number }> {

        const { limit, skip } = options;

        const total = await SaleModel.countDocuments({
            date: { $gte: from, $lte: to },
        });

        const data = await SaleModel.find({
            date: { $gte: from, $lte: to },
        })
            .skip(skip)
            .limit(limit)
            .lean();

        return {
            data: data as ISale[],
            total,
        };
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