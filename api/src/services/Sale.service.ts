import { inject, injectable } from "tsyringe";
import { ISaleService } from "../interfaces/ISaleService";
import { ISale } from "../types/Sale.interface";
import { SaleDocument } from "../models/Sale.model";
import { IItem } from "../types/Item.interface";
import { SaleRepository } from "../repositories/Sale.repository";
import { ItemRepository } from "../repositories/Item.repository";


@injectable()
export class SaleService implements ISaleService {
    constructor(
        @inject("SaleRepository") private saleRepo: SaleRepository,
        @inject("ItemRepository") private itemRepo: ItemRepository,

    ) { }

    async create(data: ISale): Promise<SaleDocument> {
        const allItems = await this.itemRepo.findAll();

        for (const saleItem of data.items) {
            const stockItem = allItems.find(item => item.name === saleItem.name) as IItem;

            if (!stockItem) {
                throw new Error(`Item '${saleItem.name}' not found in inventory.`);
            }

            if (stockItem.quantity < saleItem.quantity) {
                throw new Error(
                    `Insufficient stock for '${saleItem.name}'. Available: ${stockItem.quantity}, Requested: ${saleItem.quantity}`
                );
            }

            const newQuantity = stockItem.quantity - saleItem.quantity;

            await this.itemRepo.update(stockItem._id!, { quantity: newQuantity });
        }
        return await this.saleRepo.create(data);
    }

    async findPaginated(options: { limit?: number; skip?: number; sort?: any; }, query?: any,): Promise<{ data: SaleDocument[] | []; total: number }> {
        return await this.saleRepo.findPaginated(query, options);
    }

    async delete(id: string): Promise<void> {
        await this.saleRepo.delete(id);
    }

    async findAll(): Promise<SaleDocument[]> {
        return await this.saleRepo.findAll()
    }

    async findById(id: string): Promise<SaleDocument | null> {
        return await this.saleRepo.findById(id);
    }

    async update(id: string, data: Partial<ISale>): Promise<SaleDocument | null> {
        return await this.saleRepo.update(id, data);
    }



    async getCustomerLedger(customerName: string , options : {limit : number , skip : number}): Promise<{
        data: { date: Date; type: "Sale"; amount: number }[];
        total: number;
    }> {
        const ledger = await this.saleRepo.getCustomerLedger(customerName , options);

        return ledger;
    }

    async findSalesByDateRange(from: Date, to: Date , options: { limit: number; skip: number }): Promise<{ data: ISale[]; total: number }> {
        return await this.saleRepo.findSalesByDateRange(from, to , options);
    }

    async getFilteredSales(from: string, to: string, customer?: string): Promise<ISale[]> {
        return await this.saleRepo.getFilteredSales(from, to, customer);
    }
}