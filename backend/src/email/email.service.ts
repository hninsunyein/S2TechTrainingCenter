import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendOtp(to: string, otp: string, name: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'S2 Tech <noreply@s2tech.com>',
        to,
        subject: 'S2 Tech — Your Password Reset OTP',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px">
            <h2 style="color:#0ea5c8;margin-bottom:8px">S2 Tech Training Center</h2>
            <p style="color:#374151">Hi <strong>${name}</strong>,</p>
            <p style="color:#374151">Your one-time password (OTP) to reset your password is:</p>
            <div style="font-size:36px;font-weight:800;letter-spacing:8px;color:#0c4a6e;background:#e0f2fe;padding:20px;border-radius:8px;text-align:center;margin:24px 0">${otp}</div>
            <p style="color:#6b7280;font-size:13px">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
            <p style="color:#6b7280;font-size:13px">If you did not request this, please ignore this email.</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
            <p style="color:#9ca3af;font-size:11px">S2 Tech Training Center · Study Smart</p>
          </div>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send OTP email', err);
    }
  }
}
