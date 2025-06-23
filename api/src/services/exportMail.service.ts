import nodemailer from "nodemailer";

export class ExportEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
      },
    });
  }

  async send(to: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: "Inventrix",
      to,
      subject: "Sales Report",
      html,
    });
  }
}
