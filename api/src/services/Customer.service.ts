import { inject, injectable } from "tsyringe";
import { ICustomerService } from "../interfaces/ICustomerService";
import { CustomerDocument } from "../models/Customer.model";
import { ICustomer } from "../types/Customer.interface";
import { CustomerRepository } from "../repositories/Customer.repository";


@injectable()
export class CustomerService implements ICustomerService {
    constructor(
        @inject("CustomerRepository") private customerRepo : CustomerRepository
    ){}

    async create(data: ICustomer): Promise<CustomerDocument> {
        return await this.customerRepo.create(data);
    }

    async findPaginated( options: { limit?: number; skip?: number; sort?: any; } ,query?: any,): Promise<{data : CustomerDocument[] | []; total : number}> {
        return await this.customerRepo.findPaginated(query , options);
    }
    
    async delete(id: string): Promise<void> {
        await this.customerRepo.delete(id);
    }

    async findAll(): Promise<CustomerDocument[]> {
        return await this.customerRepo.findAll()
    }

    async findById(id: string): Promise<CustomerDocument | null> {
        return await this.customerRepo.findById(id);
    }

    async update(id: string, data: Partial<ICustomer>): Promise<CustomerDocument | null> {
        return await this.customerRepo.update(id , data);
    }
}