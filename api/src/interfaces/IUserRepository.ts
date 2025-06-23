import { UserDocument } from "../models/User.model";

export interface IUserRepository {
    findByEmail(email : string): Promise<UserDocument | null>;
}