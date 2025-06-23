import { ItemDocument } from "../models/Item.model";
import { IItem } from "../types/Item.interface";


export interface IItemService {
    create(data: IItem): Promise<ItemDocument>;
    findAll(): Promise<ItemDocument[]>;
    findById(id: string): Promise<ItemDocument | null>;
    update(id: string, data: Partial<IItem>): Promise<ItemDocument | null>;
    delete(id: string): Promise<void>;
    findPaginated( options: { limit?: number; skip?: number; sort?: any }, query?: any ,): Promise<{data : ItemDocument[] | []; total : number}>
    findByAny(query : Partial<IItem>): Promise<ItemDocument | null>;
    getItemSalesAndStock(): Promise<{ name: string; sold: number; stock: number ,price: number ,totalSales : number}[]>
}