import { ItemDocument } from "../models/Item.model";
import { IItem } from "../types/Item.interface";

export interface IItemRepository {
    getItemSalesAndStock(): Promise<{ name: string; sold: number; stock: number ,price: number ,totalSales : number}[]>;
    findByAny(query : Partial<IItem>): Promise<ItemDocument | null> 
}