import { CustomerDocument } from "../models/Customer.model";
import { ICustomer } from "../types/Customer.interface";

export interface ICustomerService {
    create(data: ICustomer): Promise<CustomerDocument>;
    findAll(): Promise<CustomerDocument[]>;
    findById(id: string): Promise<CustomerDocument | null>;
    update(id: string, data: Partial<ICustomer>): Promise<CustomerDocument | null>;
    delete(id: string): Promise<void>;
    findPaginated( options: { limit?: number; skip?: number; sort?: any }, query?: any ,): Promise<{data : CustomerDocument[] | []; total : number}>
}