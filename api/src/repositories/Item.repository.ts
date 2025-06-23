import { injectable } from "tsyringe";
import { BaseRepository } from "./Base.repository";
import { ItemDocument, ItemModel } from "../models/Item.model";
import { IItemRepository } from "../interfaces/IItemRepository";
import { SaleModel } from "../models/Sale.model";
import { IItem } from "../types/Item.interface";

@injectable()
export class ItemRepository extends BaseRepository<ItemDocument> implements IItemRepository {
    constructor() {
        super(ItemModel)
    }

    async getItemSalesAndStock(): Promise<{ name: string; sold: number; stock: number ,price: number ,totalSales : number}[]> {
        const items = await ItemModel.find();

        const sales = await SaleModel.find();

        // Map item name to total sold
        const salesCountMap = new Map<string, number>();

        for (const sale of sales) {
            for (const saleItem of sale.items) {
                const itemName = saleItem.name.toString(); // name is a string
                const current = salesCountMap.get(itemName) || 0;
                salesCountMap.set(itemName, Number(current) + Number(saleItem.quantity));
            }
        }

        return items.map(item => {
            const sold = salesCountMap.get(item.name) || 0;
            const totalSales = sold * item.price;

            return {
                name: item.name,
                sold,
                stock: item.quantity,
                price: item.price,
                totalSales,
            };
        });
    }

    async findByAny(query: Partial<IItem>): Promise<ItemDocument | null> {
        return await ItemModel.findOne(query);
    }
}