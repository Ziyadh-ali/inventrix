import { Response } from "express";
import { ISale } from "../types/Sale.interface";

export class ExportPrintService {
  render(salesData: ISale[], res: Response): void {
    const html = `
      <html>
        <head>
          <title>Sales Report</title>
          <style>
            body { font-family: sans-serif; margin: 2rem; }
            .sale-entry { margin-bottom: 2rem; }
            hr { border: none; border-top: 1px solid #ccc; }
            h1 { text-align: center; }
          </style>
        </head>
        <body>
          <h1>Sales Report</h1>
          ${salesData.map(sale => {
            const total = sale.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
            return `
              <div class="sale-entry">
                <p><strong>Date:</strong> ${new Date(sale.date).toLocaleDateString()}</p>
                <p><strong>Customer:</strong> ${sale.customerName}</p>
                <p><strong>Items:</strong> ${sale.items.map(i => `${i.name} (${i.quantity})`).join(", ")}</p>
                <p><strong>Total:</strong> ₹${total.toFixed(2)}</p>
                <hr />
              </div>
            `;
          }).join("")}
        </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  }
}
