import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { MESSAGES } from "../helper/constants/messages";
import { STATUS_CODES } from "../helper/constants/statusCodes";
import { SaleValidation } from "../utils/Validations/Validation";
import { ISaleService } from "../interfaces/ISaleService";


@injectable()
export class SaleController {
    constructor(
        @inject("ISaleService") private saleService: ISaleService
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = SaleValidation.parse(req.body);

            const sale = await this.saleService.create(validatedData);

            res.status(STATUS_CODES.OK).json({
                sale,
                message: MESSAGES.SUCCESS.CUSTOMER_CREATED,
            });
        } catch (error) {
            console.log(error)
            if (error instanceof Error && "issues" in error) {
                const issues = (error as any).issues;
                res.status(STATUS_CODES.BAD_REQUEST).json({ errors: issues });
            } else if (error instanceof Error) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });

            }
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR.SERVER_ERROR });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            await this.saleService.delete(id);

            res.status(STATUS_CODES.OK).json({
                message: MESSAGES.SUCCESS.CUSTOMER_DELETED,
            });
        } catch (error) {
            if (error instanceof Error && "issues" in error) {
                console.log(error)
                const issues = (error as any).issues;
                res.status(STATUS_CODES.BAD_REQUEST).json({ errors: issues });
            } else if (error instanceof Error) {
                console.log(error)
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });

            }
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR.SERVER_ERROR });
        }
    }

    async fetchById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const sale = await this.saleService.findById(id);

            res.status(STATUS_CODES.OK).json({
                sale,
            });
        } catch (error) {
            if (error instanceof Error && "issues" in error) {
                console.log(error)
                const issues = (error as any).issues;
                res.status(STATUS_CODES.BAD_REQUEST).json({ errors: issues });
            }
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR.SERVER_ERROR });
        }
    }
    async fetchAll(req: Request, res: Response): Promise<void> {
        try {
            const sales = await this.saleService.findAll();

            res.status(STATUS_CODES.OK).json({
                sales,
            });
        } catch (error) {
            if (error instanceof Error && "issues" in error) {
                console.log(error)
                const issues = (error as any).issues;
                res.status(STATUS_CODES.BAD_REQUEST).json({ errors: issues });
            }
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR.SERVER_ERROR });
        }
    }
    async fetch(req: Request, res: Response): Promise<void> {
        try {
            const options = {
                limit: parseInt(req.query.limit as string),
                skip: parseInt(req.query.skip as string),
                sort: req.query.sort,
            };

            console.log(options);
            const sales = await this.saleService.findPaginated(options);

            res.status(STATUS_CODES.OK).json({
                sales,
            });
        } catch (error) {
            if (error instanceof Error && "issues" in error) {
                console.log(error)
                const issues = (error as any).issues;
                res.status(STATUS_CODES.BAD_REQUEST).json({ errors: issues });
            }
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR.SERVER_ERROR });
        }
    }

    async getCustomerLedger(req: Request, res: Response) {
        const { customerName } = req.params;
        const options = {
            limit: parseInt(req.query.limit as string),
            skip: parseInt(req.query.skip as string),
        };
        try {
            const ledger = await this.saleService.getCustomerLedger(customerName, options);
            res.status(200).json({ ledger });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to get customer ledger" });
        }
    }

    async getSalesByDateRange(req: Request, res: Response) {
        try {
            const from = new Date(req.query.from as string);
            const to = new Date(req.query.to as string);
            const options = {
                limit: parseInt(req.query.limit as string),
                skip: parseInt(req.query.skip as string),
            };

            if (isNaN(from.getTime()) || isNaN(to.getTime())) {
                res.status(400).json({ message: "Invalid date format" });
            }

            const sales = await this.saleService.findSalesByDateRange(from, to , options);
            res.status(STATUS_CODES.OK).json({sales});
        } catch (err) {
            // console.error("Error in findSalesByDateRange:", err);
            res.status(500).json({ message: "Something went wrong on the server." });
        }
    }


}