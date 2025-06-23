import ExcelJS from "exceljs";
import { Response } from "express";
import { ISale } from "../types/Sale.interface";
import { injectable } from "tsyringe";

@injectable()
export class ExportExcelService {
  async export(salesData: ISale[], res: Response): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales Report");

    worksheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Customer", key: "customerName", width: 25 },
      { header: "Items", key: "items", width: 40 },
      { header: "Total Amount", key: "total", width: 20 }
    ];

    salesData.forEach(sale => {
      worksheet.addRow({
        date: new Date(sale.date).toLocaleDateString(),
        customerName: sale.customerName,
        items: sale.items.map(i => `${i.name} (${i.quantity})`).join(", "),
        total: sale.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="sales-report.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  }
}
