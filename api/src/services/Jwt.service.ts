import jwt from "jsonwebtoken"; 
import { injectable } from "tsyringe"; 
import { TokenPayload } from "../types/TokenPayload"; 
 
@injectable() 
export class JwtService { 
    private readonly accessSecret = process.env.JWT_ACCESS || "secret"; 
    private readonly refreshSecret = process.env.JWT_REFRESH||"secret"; 
    private readonly accessTokenExpiry = "15m"; 
    private readonly refreshTokenExpiry = "7d"; 
 
    signAccessToken(payload: TokenPayload): string { 
        
        const token = jwt.sign(payload, this.accessSecret, { 
            expiresIn: this.accessTokenExpiry, 
        });
        
        console.log("Generated token:", token.substring(0, 50) + "...");
        return token;
    } 
 
    signRefreshToken(payload: TokenPayload): string { 
        return jwt.sign(payload, this.refreshSecret, { 
            expiresIn: this.refreshTokenExpiry, 
        }); 
    } 
 
    verifyAccessToken(token: string): TokenPayload { 
        try {
            
            const decoded = jwt.verify(token, this.accessSecret) as TokenPayload;
            return decoded;
        } catch (err) {
            if (err instanceof jwt.JsonWebTokenError) {
                console.error("JWT Error type:", err.name);
                console.error("JWT Error message:", err.message);
            }
            throw new Error("Invalid access token"); 
        } 
    } 
 
    verifyRefreshToken(token: string): TokenPayload { 
        try { 
            return jwt.verify(token, this.refreshSecret) as TokenPayload; 
        } catch (err) { 
            console.error("Refresh token verification failed:", err);
            throw new Error("Invalid refresh token"); 
        } 
    } 
}