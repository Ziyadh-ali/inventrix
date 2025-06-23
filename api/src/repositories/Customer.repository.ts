import { injectable } from "tsyringe";
import { BaseRepository } from "./Base.repository";
import { CustomerDocument, CustomerModel } from "../models/Customer.model";
import { ICustomerRepository } from "../interfaces/ICustomerRepository";

@injectable()
export class CustomerRepository extends BaseRepository<CustomerDocument> implements ICustomerRepository {
    constructor(){
        super(CustomerModel)
    }
}