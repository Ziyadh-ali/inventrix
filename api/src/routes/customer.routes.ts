import { Request, Response, Router } from "express";
import { customerController } from "../DI/resolver";
import { authenticate } from "../helper/middlewares/authMiddleware";

export class CustomerRoute {
    public router: Router;

    private customerController;

    constructor() {
        this.router = Router();
        this.customerController = customerController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .post(
                "/",
                authenticate,
                (req: Request, res: Response) => this.customerController.create(req, res),
            )
            .patch(
                "/:id",
                authenticate,
                (req: Request, res: Response) => this.customerController.update(req, res),
            )
            .delete(
                "/:id",
                authenticate,
                (req: Request, res: Response) => this.customerController.delete(req, res),
            )
            .get(
                "/",
                authenticate,
                (req: Request, res: Response) => this.customerController.fetch(req, res),
            )
            .get(
                "/all",
                authenticate,
                (req: Request, res: Response) => this.customerController.fetchAll(req, res),
            )
            .get(
                "/:id",
                authenticate,
                (req: Request, res: Response) => this.customerController.fetchById(req, res),
            )
    }
}

