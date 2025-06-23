import { Request, Response, Router } from "express";
import { userController } from "../DI/resolver";
import { authenticate } from "../helper/middlewares/authMiddleware";

export class UserRoute {
    public router : Router;

    private userController;

    constructor() {
        this.router = Router();
        this.userController = userController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .post(
                "/register",
                (req: Request, res: Response) => this.userController.signup(req , res),
            )
        
        this.router
            .post(
                "/login",
                (req: Request, res: Response) => this.userController.login(req , res),
            )
        
        this.router
            .post(
                "/logout",
                // authenticate,
                (req: Request, res: Response) => this.userController.logout(req , res),
            )
        
    }
}

