import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { MESSAGES } from "../helper/constants/messages";
import { STATUS_CODES } from "../helper/constants/statusCodes";
import { ItemValidation } from "../utils/Validations/Validation";
import { IItemService } from "../interfaces/IItemService";


@injectable()
export class ItemController {
    constructor(
        @inject("IItemService") private itemService: IItemService
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const validatedData = ItemValidation.parse(req.body);

            const item = await this.itemService.create(validatedData);

            res.status(STATUS_CODES.OK).json({
                item,
                message: MESSAGES.SUCCESS.ITEM_CREATED,
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
            const item = await this.itemService.update(id, data);

            res.status(STATUS_CODES.OK).json({
                item,
                message: MESSAGES.SUCCESS.ITEM_UPDATED,
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

            await this.itemService.delete(id);

            res.status(STATUS_CODES.OK).json({
                message: MESSAGES.SUCCESS.ITEM_DELETED,
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

            const item = await this.itemService.findById(id);

            res.status(STATUS_CODES.OK).json({
                item,
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
            const items = await this.itemService.findAll();

            res.status(STATUS_CODES.OK).json({
                items,
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
            const items = await this.itemService.findPaginated(options);

            res.status(STATUS_CODES.OK).json({
                items,
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
    async fetchByAny(req: Request, res: Response): Promise<void> {
        try {
            const query = req.body;
            const item = await this.itemService.findByAny(query);

            res.status(STATUS_CODES.OK).json({
                item,
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

    async getItemSalesAndStock(req: Request, res: Response): Promise<void> {
        try {
            const report = await this.itemService.getItemSalesAndStock();
            res.status(STATUS_CODES.OK).json({ report });
        } catch (error) {
            console.error("Error fetching item sales and stock report:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}