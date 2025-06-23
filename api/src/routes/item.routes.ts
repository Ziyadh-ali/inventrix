import { Request, Response, Router } from "express";
import { itemController } from "../DI/resolver";
import { authenticate } from "../helper/middlewares/authMiddleware";

export class ItemRoute {
    public router: Router;

    private itemController;

    constructor() {
        this.router = Router();
        this.itemController = itemController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .post(
                "/",
                authenticate,
                (req: Request, res: Response) => this.itemController.create(req, res),
            )
            .patch(
                "/:id",
                authenticate,
                (req: Request, res: Response) => this.itemController.update(req, res),
            )
            .delete(
                "/:id",
                authenticate,
                (req: Request, res: Response) => this.itemController.delete(req, res),
            )
            .get(
                "/",
                authenticate,
                (req: Request, res: Response) => this.itemController.fetch(req, res),
            )
            .get(
                "/all",
                authenticate,
                (req: Request, res: Response) => this.itemController.fetchAll(req, res),
            )
            .get(
                "/report",
                authenticate,
                (req: Request, res: Response) => this.itemController.getItemSalesAndStock(req, res)
            )
            .get(
                "/:id",
                authenticate,
                (req: Request, res: Response) => this.itemController.fetchById(req, res),
            )
    }
}

