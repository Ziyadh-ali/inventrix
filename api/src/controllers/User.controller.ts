import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { UserService } from "../services/User.service";
import { CreateUserSchema } from "../utils/Validations/Validation";
import { STATUS_CODES } from "../helper/constants/statusCodes";
import { MESSAGES } from "../helper/constants/messages";
import { PasswordHelper } from "../utils/PasswordHelper";
import { CookieHelper } from "../utils/CookieHelper";
import { JwtService } from "../services/Jwt.service";

@injectable()
export class UserController {
    constructor(
        @inject("IUserService") private userService: UserService,
        @inject("PasswordHelper") private passwordHelper: PasswordHelper,
        @inject("CookieHelper") private cookieHelper: CookieHelper,
        @inject("JwtService") private jwtService: JwtService,
    ) { }

    async signup(req: Request, res: Response): Promise<void> {
        try {
            const validateData = CreateUserSchema.parse(req.body);
            const isExisting = await this.userService.findByEmail(validateData.email);
            if (isExisting) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.ERROR.USER_EXISTS });
                return;
            }
            const hashedPassword = await this.passwordHelper.hash(validateData.password);
            const user = await this.userService.create({
                ...validateData,
                password: hashedPassword,
            })
            res.status(STATUS_CODES.OK).json({ user, message: MESSAGES.SUCCESS.USER_CREATED });
        } catch (error) {
            if (error instanceof Error && "issues" in error) {
                console.log(error)
                const issues = (error as any).issues;
                res.status(STATUS_CODES.BAD_REQUEST).json({ errors: issues });
            }
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR.SERVER_ERROR });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const validateData = CreateUserSchema.parse(req.body);
            const user = await this.userService.findByEmail(validateData.email);
            if (!user) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.ERROR.USER_NOT_FOUND });
                return
            }

            const isPassword = await this.passwordHelper.compare(validateData.password, user?.password!);

            if (!isPassword) {
                res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.ERROR.INVALID_CREDENTIALS });
                return
            }

            const accessToken = this.jwtService.signAccessToken({
                id: user._id.toString(),
                email: user ? user.email : ""
            });

            const refreshToken = this.jwtService.signRefreshToken({
                id: user._id.toString(),
                email: user ? user.email : ""
            });

            this.cookieHelper.setAuthCookies(res, accessToken, refreshToken);

            res.status(STATUS_CODES.OK).json({
                user: {
                    _id: user._id,
                    email: user.email,
                },
                accessToken,
                refreshToken,
                message: MESSAGES.SUCCESS.USER_LOGIN,
            });
        } catch (error) {
            if (error instanceof Error && "issues" in error) {
                const issues = (error as any).issues;
                res.status(400).json({ errors: issues });
            }
            res.status(500).json({ message: MESSAGES.ERROR.SERVER_ERROR });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            this.cookieHelper.clearAuthCookies(res);

            res.status(STATUS_CODES.OK).json({ message: MESSAGES.SUCCESS.USER_LOGOUT });
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR.SERVER_ERROR });
        }
    }

}