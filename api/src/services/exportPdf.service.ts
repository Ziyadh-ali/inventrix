import PDFDocument from "pdfkit";
import { Response } from "express";
import { ISale } from "../types/Sale.interface";

export class ExportPDFService {
  export(salesData: ISale[], res: Response): void {
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="sales-report.pdf"`);

    doc.pipe(res);

    doc.fontSize(16).text("Sales Report", { align: "center" });
    doc.moveDown();

    salesData.forEach((sale) => {
      const total = sale.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      doc.fontSize(12).text(`Date: ${new Date(sale.date).toLocaleDateString()}`);
      doc.text(`Customer: ${sale.customerName}`);
      doc.text(`Items: ${sale.items.map((i) => `${i.name} (${i.quantity})`).join(", ")}`);
      doc.text(`Total: ₹${total.toFixed(2)}`);
      doc.moveDown();
    });

    doc.end();
  }
}
