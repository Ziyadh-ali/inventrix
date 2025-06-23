import { Request, Response, Router } from "express";
import { exportController } from "../DI/resolver";
import { authenticate } from "../helper/middlewares/authMiddleware";

export class ExportRoute {
    public router: Router
    private exportController

    constructor() {
        this.router = Router();
        this.exportController = exportController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .get(
                "/excel",
                authenticate,
                (req: Request, res: Response) => this.exportController.exportExcel(req, res))

            .get(
                "/pdf",
                authenticate,
                (req: Request, res: Response) => this.exportController.exportPDF(req, res))

            .post(
                "/email",
                authenticate,
                (req: Request, res: Response) => this.exportController.sendEmail(req, res))

            .get(
                "/print",
                authenticate,
                (req: Request, res: Response) => this.exportController.renderPrintable(req, res))
    }
}   