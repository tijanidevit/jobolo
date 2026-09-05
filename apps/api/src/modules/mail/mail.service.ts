import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

/**
 * Mail service — SMTP-backed transactional email.
 *
 * All SMTP settings are configurable via environment variables:
 *   MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USER, MAIL_PASS, MAIL_FROM, MAIL_FROM_NAME
 *
 * Compatible with any SMTP provider — Resend (smtp.resend.com:587), SendGrid, Mailgun,
 * Brevo, Postmark, or a local SMTP server.
 *
 * To use Resend SMTP:
 *   MAIL_HOST=smtp.resend.com
 *   MAIL_PORT=587
 *   MAIL_SECURE=false
 *   MAIL_USER=resend
 *   MAIL_PASS=<your-resend-api-key>
 *   MAIL_FROM=noreply@yourdomain.com
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter;
  private readonly fromAddress: string;
  private readonly frontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    const host = configService.get<string>('mail.host') ?? 'smtp.resend.com';
    const port = configService.get<number>('mail.port') ?? 587;
    const secure = configService.get<boolean>('mail.secure') ?? false;
    const user = configService.get<string>('mail.user') ?? '';
    const pass = configService.get<string>('mail.pass') ?? '';
    const fromName = configService.get<string>('mail.fromName') ?? 'Jobolo';
    const fromEmail = configService.get<string>('mail.from') ?? 'noreply@jobolo.app';

    this.fromAddress = `"${fromName}" <${fromEmail}>`;
    this.frontendUrl = configService.get<string>('app.frontendUrl') ?? 'http://localhost:3000';

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  async sendEmailVerification(
    to: string,
    firstName: string,
    token: string,
  ): Promise<void> {
    const verifyUrl = `${this.frontendUrl}/auth/verify-email?token=${token}`;

    if (!this.isConfigured()) {
      this.logger.log(`[DEV] Email verification for ${to}: ${verifyUrl}`);
      return;
    }

    await this.transporter.sendMail({
      from: this.fromAddress,
      to,
      subject: 'Verify your Jobolo email address',
      html: this.emailVerificationTemplate(firstName, verifyUrl),
    });

    this.logger.log(`Verification email sent to ${to}`);
  }

  async sendPasswordReset(
    to: string,
    firstName: string,
    token: string,
  ): Promise<void> {
    const resetUrl = `${this.frontendUrl}/auth/reset-password?token=${token}`;

    if (!this.isConfigured()) {
      this.logger.log(`[DEV] Password reset for ${to}: ${resetUrl}`);
      return;
    }

    await this.transporter.sendMail({
      from: this.fromAddress,
      to,
      subject: 'Reset your Jobolo password',
      html: this.passwordResetTemplate(firstName, resetUrl),
    });

    this.logger.log(`Password reset email sent to ${to}`);
  }

  /**
   * Returns false when MAIL_USER/MAIL_PASS are not configured.
   * In development, emails are logged to the console instead of being sent.
   */
  private isConfigured(): boolean {
    return !!(
      this.configService.get<string>('mail.user') &&
      this.configService.get<string>('mail.pass')
    );
  }

  private emailVerificationTemplate(firstName: string, url: string): string {
    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify your email address</h2>
        <p>Hi ${firstName},</p>
        <p>Thanks for creating your Jobolo account. Please verify your email address to get started.</p>
        <p>
          <a href="${url}" style="background:#4f46e5;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
            Verify Email
          </a>
        </p>
        <p>This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.</p>
      </div>
    `;
  }

  private passwordResetTemplate(firstName: string, url: string): string {
    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your Jobolo password.</p>
        <p>
          <a href="${url}" style="background:#4f46e5;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
            Reset Password
          </a>
        </p>
        <p>This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `;
  }
}
