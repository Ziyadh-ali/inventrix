import { injectable } from "tsyringe";
import { BaseRepository } from "./Base.repository";
import { UserDocument, UserModel } from "../models/User.model";
import { IUserRepository } from "../interfaces/IUserRepository";

@injectable()
export class UserRepository extends BaseRepository<UserDocument> implements IUserRepository {
    constructor() {
        super(UserModel)
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return await UserModel.findOne({ email })
    }
}