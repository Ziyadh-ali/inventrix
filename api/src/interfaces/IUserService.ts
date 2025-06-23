import { UserDocument } from "../models/User.model";
import { IUser } from "../types/User.interface";

export interface IUserService {
    create(data: IUser): Promise<UserDocument>;
    findAll(): Promise<UserDocument[]>;
    findById(id: string): Promise<UserDocument | null>;
    findByEmail(email: string): Promise<UserDocument | null>;
    update(id: string, data: Partial<IUser>): Promise<UserDocument | null>;
    delete(id: string): Promise<void>;
}
