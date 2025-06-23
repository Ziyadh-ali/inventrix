import { Response, Request, NextFunction } from "express"; 
import { jwtService } from "../../DI/resolver"; 
import { STATUS_CODES } from "../constants/statusCodes"; 
 
export const authenticate = async (req: Request, res: Response, next: NextFunction) => { 
    try { 
        const authHeader = req.headers.authorization; 
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "Missing or invalid token" }); 
            return;
        } 
 
        const token = authHeader.split(" ")[1];
 
        const decoded = jwtService.verifyAccessToken(token);
        
        req.user = decoded; 
        next(); 
    } catch (error) { 
        res.status(STATUS_CODES.UNAUTHORIZED).json({ message: "Invalid or expired access token" });
        return;
    } 
}