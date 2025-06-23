import { inject, injectable } from "tsyringe";
import { IItem } from "../types/Item.interface";
import { ItemDocument } from "../models/Item.model";
import { IItemService } from "../interfaces/IItemService";
import { ItemRepository } from "../repositories/Item.repository";

@injectable()
export class ItemService implements IItemService {
    constructor(
        @inject("ItemRepository") private itemRepo: ItemRepository,
    ) { }

    async create(data: IItem): Promise<ItemDocument> {
        return await this.itemRepo.create(data);
    }

    async findAll(): Promise<ItemDocument[]> {
        return await this.itemRepo.findAll();
    }

    async delete(id: string): Promise<void> {
        await this.itemRepo.delete(id);
    }

    async findById(id: string): Promise<ItemDocument | null> {
        return await this.itemRepo.findById(id);
    }

    async update(id: string, data: Partial<IItem>): Promise<ItemDocument | null> {
        return await this.itemRepo.update(id, data);
    }

    async findPaginated(options: { limit?: number; skip?: number; sort?: any; }, query?: any): Promise<{ data: ItemDocument[] | []; total: number; }> {
        return await this.itemRepo.findPaginated(options);
    }

    async findByAny(query: Partial<IItem>): Promise<ItemDocument | null> {
        return await this.itemRepo.findByAny(query);
    }

     async getItemSalesAndStock(): Promise<{ name: string; sold: number; stock: number ,price: number ,totalSales : number}[]> {
        return await this.itemRepo.getItemSalesAndStock();
    }
}