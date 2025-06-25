import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { ICustomerService } from "../interfaces/ICustomerService";
import { MESSAGES } from "../helper/constants/messages";
import { STATUS_CODES } from "../helper/constants/statusCodes";
import { CustomerValidation } from "../utils/Validations/Validation";


@injectable()
export class CustomerController {
    constructor(
        @inject("ICustomerService") private customerService: ICustomerService
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = CustomerValidation.parse(req.body);

            const customer = await this.customerService.create(validatedData);

            res.status(STATUS_CODES.OK).json({
                customer,
                message: MESSAGES.SUCCESS.CUSTOMER_CREATED,
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

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const data = req.body;
            if (!data) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.ERROR.NO_DATA });
                return;
            }
            const customer = await this.customerService.update(id, data);

            res.status(STATUS_CODES.OK).json({
                customer,
                message: MESSAGES.SUCCESS.CUSTOMER_UPDATED,
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
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            await this.customerService.delete(id);

            res.status(STATUS_CODES.OK).json({
                message: MESSAGES.SUCCESS.CUSTOMER_DELETED,
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
    async fetchById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const customer = await this.customerService.findById(id);

            res.status(STATUS_CODES.OK).json({
                customer,
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

            const customers = await this.customerService.findAll();

            res.status(STATUS_CODES.OK).json({
                customers,
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
                limit : parseInt(req.query.limit as string),
                skip : parseInt(req.query.skip as string),
                sort : req.query.sort,
            };
            const customers = await this.customerService.findPaginated(options);


            res.status(STATUS_CODES.OK).json({
                customers,
            });
        } catch (error) {
            console.log(error);
            if (error instanceof Error && "issues" in error) {
                console.log(error)
                const issues = (error as any).issues;
                res.status(STATUS_CODES.BAD_REQUEST).json({ errors: issues });
            }
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR.SERVER_ERROR });
        }
    }
}