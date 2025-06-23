import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import { UserRoute } from '../routes/user.routes';
import cors from "cors"
import { CustomerRoute } from '../routes/customer.routes';
import { ItemRoute } from '../routes/item.routes';
import morgan from "morgan"
import { SaleRoute } from '../routes/Sale.routes';
import { ExportRoute } from '../routes/export.routes';

export class App {
    private app: Application;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.configureRoute();
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(
            cors({
                origin: process.env.ALLOWED_ORIGIN,
                credentials: true,
            })
        );
        this.app.use(express.urlencoded());
        this.app.use(cookieParser());
        this.app.use(morgan("dev"))
    }

    private configureRoute(): void {
        const userRoute = new UserRoute();
        const customerRoute = new CustomerRoute();
        const itemRoute = new ItemRoute();
        const saleRoute = new SaleRoute();
        const exportRoute = new ExportRoute();
        this.app.use("/api/user", userRoute.router);
        this.app.use("/api/customer", customerRoute.router);
        this.app.use("/api/item", itemRoute.router);
        this.app.use("/api/sale", saleRoute.router);
        this.app.use("/api/export", exportRoute.router);
    }

    public listen(port: number | string) {
        this.app.listen(port, () => {
            console.log(`🚀 Server is running on http://localhost:${port}`);
        });
    }
}