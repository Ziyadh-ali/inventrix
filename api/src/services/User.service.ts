import { inject, injectable } from "tsyringe";
import { UserRepository } from "../repositories/User.repository";
import { IUserService } from "../interfaces/IUserService";
import { UserDocument } from "../models/User.model";
import { IUser } from "../types/User.interface";

@injectable()
export class UserService implements IUserService{
    constructor(
        @inject("UserRepository") private userRepo : UserRepository,
    ){}

    async create(data: IUser): Promise<UserDocument> {
        return await this.userRepo.create(data);
    }

    async findAll(): Promise<UserDocument[]> {
        return await this.userRepo.findAll();
    }

    async delete(id: string): Promise<void> {
        await this.userRepo.delete(id);
    }

    async findById(id: string): Promise<UserDocument | null> {
        return await this.userRepo.findById(id);
    }

    async update(id: string, data: Partial<IUser>): Promise<UserDocument | null> {
        return await this.userRepo.update(id , data);
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return await this.userRepo.findByEmail(email);
    }
}