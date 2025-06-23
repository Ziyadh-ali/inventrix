import { container } from "tsyringe";
import { Registry } from "./container";
import { JwtService } from "../services/Jwt.service";
import { UserController } from "../controllers/User.controller";
import { CustomerController } from "../controllers/Customer.controller";
import { ItemController } from "../controllers/Item.controller";
import { SaleController } from "../controllers/Sale.controller";
import { ExportController } from "../controllers/export.controller";

Registry.register();

export const jwtService = container.resolve(JwtService);

export const userController = container.resolve(UserController);

export const customerController = container.resolve(CustomerController);

export const itemController = container.resolve(ItemController);

export const saleController = container.resolve(SaleController);

export const exportController = container.resolve(ExportController);