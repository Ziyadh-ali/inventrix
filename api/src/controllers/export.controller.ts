// exportController.ts
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { ExportExcelService } from "../services/exportSalesReport.service";
import { ISaleService } from "../interfaces/ISaleService";
import { ExportPrintService } from "../services/exportPrint.service";
import { ExportEmailService } from "../services/exportMail.service";
import { ExportPDFService } from "../services/exportPdf.service";
import { ISale } from "../types/Sale.interface";

@injectable()
export class ExportController {
  constructor(
    @inject("ISaleService") private saleService: ISaleService,
    @inject("ExportExcelService") private exportExcelService: ExportExcelService,
    @inject("ExportPrintService") private exportPrintService: ExportPrintService,
    @inject("ExportEmailService") private exportEmailService: ExportEmailService,
    @inject("ExportPDFService") private exportPDFService: ExportPDFService
  ) {}

  async exportExcel(req: Request, res: Response) {
    try {
      const { from, to, customer } = req.query;
      const sales = await this.saleService.getFilteredSales(from as string, to as string, customer as string);
      return this.exportExcelService.export(sales, res);
    } catch (error) {
      console.error("Error exporting Excel report:", error);
      res.status(500).json({ message: "Failed to export Excel report" });
    }
  }

  async exportPDF(req: Request, res: Response) {
    try {
      const { from, to, customer } = req.query;
      const sales = await this.saleService.getFilteredSales(from as string, to as string, customer as string);
      return this.exportPDFService.export(sales, res);
    } catch (error) {
      console.error("Error exporting PDF report:", error);
      res.status(500).json({ message: "Failed to export PDF report" });
    }
  }

  async sendEmail(req: Request, res: Response) {
    try {
      const { from, to, customer, email } = req.body;
      const sales = await this.saleService.getFilteredSales(from, to, customer);
      const html = renderHTMLFromSales(sales);
      await this.exportEmailService.send(email, html);
      res.json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending sales report email:", error);
      res.status(500).json({ message: "Failed to send sales report email" });
    }
  }

  async renderPrintable(req: Request, res: Response) {
    try {
      const { from, to, customer } = req.query;
      const sales = await this.saleService.getFilteredSales(from as string, to as string, customer as string);
      return this.exportPrintService.render(sales, res);
    } catch (error) {
      console.error("Error rendering printable report:", error);
      res.status(500).send("Failed to render printable report");
    }
  }
}

function renderHTMLFromSales(sales: ISale[]) {
  return `
    <html>
      <head><title>Sales Report</title></head>
      <body>
        <h1>Sales Report</h1>
        ${sales
          .map((sale) => {
            const total = sale.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
            return `
              <div>
                <p><strong>Date:</strong> ${new Date(sale.date).toLocaleDateString()}</p>
                <p><strong>Customer:</strong> ${sale.customerName}</p>
                <p><strong>Items:</strong> ${sale.items.map((i) => `${i.name} (${i.quantity})`).join(", ")}</p>
                <p><strong>Total:</strong> ₹${total.toFixed(2)}</p>
                <hr />
              </div>
            `;
          })
          .join("")}
      </body>
    </html>
  `;
}
