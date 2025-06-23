import bcrypt from "bcrypt";
import { injectable } from "tsyringe";

@injectable()
export class PasswordHelper {
    async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    async compare(newPassword: string, oldPassword: string): Promise<boolean> {
        return bcrypt.compare(newPassword, oldPassword);
    }
}