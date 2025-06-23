import { container } from "tsyringe";
import { PasswordHelper } from "../utils/PasswordHelper";
import { JwtService } from "../services/Jwt.service";
import { IUserService } from "../interfaces/IUserService";
import { UserService } from "../services/User.service";
import { CookieHelper } from "../utils/CookieHelper";
import { UserController } from "../controllers/User.controller";
import { ICustomerService } from "../interfaces/ICustomerService";
import { CustomerService } from "../services/Customer.service";
import { CustomerController } from "../controllers/Customer.controller";
import { IItemService } from "../interfaces/IItemService";
import { ItemService } from "../services/Item.service";
import { ItemController } from "../controllers/Item.controller";
import { ISaleService } from "../interfaces/ISaleService";
import { SaleService } from "../services/Sale.service";
import { SaleController } from "../controllers/Sale.controller";
import { ExportExcelService } from "../services/exportSalesReport.service";
import { ExportPrintService } from "../services/exportPrint.service";
import { ExportEmailService } from "../services/exportMail.service";
import { ExportPDFService } from "../services/exportPdf.service";
import { ExportController } from "../controllers/export.controller";
import { CustomerRepository } from "../repositories/Customer.repository";
import { ItemRepository } from "../repositories/Item.repository";
import { SaleRepository } from "../repositories/Sale.repository";
import { UserRepository } from "../repositories/User.repository";

export class Registry {
    static register(): void {
        container.register("ItemRepository", {
            useClass: ItemRepository,
        });
        container.register("UserRepository", {
            useClass: UserRepository,
        });
        container.register<IUserService>("IUserService", {
            useClass: UserService,
        });
        container.register("PasswordHelper", {
            useClass: PasswordHelper,
        });
        container.register("JwtService", {
            useClass: JwtService,
        });
        container.register("CookieHelper", {
            useClass: CookieHelper,
        });
        container.register("UserController", {
            useClass: UserController,
        });
        container.register("CustomerRepository", {
            useClass: CustomerRepository,
        });
        container.register<ICustomerService>("ICustomerService", {
            useClass: CustomerService,
        });
        container.register("CustomerController", {
            useClass: CustomerController,
        });
        container.register("ItemRepository", {
            useClass: ItemRepository,
        });
        container.register<IItemService>("IItemService", {
            useClass: ItemService,
        });
        container.register("ItemController", {
            useClass: ItemController,
        });
        container.register("SaleRepository", {
            useClass: SaleRepository,
        });
        container.register<ISaleService>("ISaleService", {
            useClass: SaleService,
        });
        container.register("SaleController", {
            useClass: SaleController,
        });
        container.register("ExportExcelService", {
            useClass: ExportExcelService,
        });
        container.register("ExportPrintService", {
            useClass: ExportPrintService,
        });
        container.register("ExportEmailService", {
            useClass: ExportEmailService,
        });
        container.register("ExportPDFService", {
            useClass: ExportPDFService,
        });
        container.register("ExportController", {
            useClass: ExportController,
        });
    }
}