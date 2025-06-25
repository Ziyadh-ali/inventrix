import { ItemDocument } from "../models/Item.model";
import { IItem } from "../types/Item.interface";

export interface IItemRepository {
    getItemSalesAndStock(opitons: { limit: number, skip: number }): Promise<{ data: { name: string; sold: number; stock: number, price: number, totalSales: number }[]; total: number }>;
    findByAny(query: Partial<IItem>): Promise<ItemDocument | null>
}