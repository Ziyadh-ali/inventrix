import { Request, Response, Router } from "express";
import { saleController } from "../DI/resolver";
import { authenticate } from "../helper/middlewares/authMiddleware";

export class SaleRoute {
    public router: Router
    private saleController

    constructor() {
        this.router = Router();
        this.saleController = saleController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .post(
                "/",
                authenticate,
                (req: Request, res: Response) => this.saleController.create(req, res),
            )
            .delete(
                "/:id",
                authenticate,
                (req: Request, res: Response) => this.saleController.delete(req, res),
            )
            .get(
                "/",
                authenticate,
                (req: Request, res: Response) => this.saleController.fetch(req, res),
            )
            .get(
                "/all",
                authenticate,
                (req: Request, res: Response) => this.saleController.fetchAll(req, res),
            )
            .get(
                "/dateRange",
                authenticate,
                (req: Request, res: Response) => this.saleController.getSalesByDateRange(req, res),
            )


            .get(
                "/ledger/:customerName",
                authenticate,
                (req: Request, res: Response) => this.saleController.getCustomerLedger(req, res),
            )
            .get(
                "/:id",
                authenticate,
                (req: Request, res: Response) => this.saleController.fetchById(req, res),
            )
    }
}   