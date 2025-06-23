import { Response, Request } from "express";
import { inject } from "tsyringe";
import { JwtService } from "../services/Jwt.service";
import { STATUS_CODES } from "../helper/constants/statusCodes";

export class refreshToken {
    constructor(
        @inject("JwtService") private jwtService : JwtService,
    ){}

    async execute(req : Request , res : Response): Promise<void> {
        try {
            const token = req.cookies.refreshToken;
            if (!token) res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "No refresh token" });
            
            const payload = this.jwtService.verifyRefreshToken(token);
            const newAccessToken = this.jwtService.signAccessToken({id : payload.id , email : payload.email});

            res.status(STATUS_CODES.OK).json({ accessToken : newAccessToken})
        } catch (error) {
            res.status(STATUS_CODES.FORBIDDEN).json({ message: "Invalid refresh token" });
        }
    }
}