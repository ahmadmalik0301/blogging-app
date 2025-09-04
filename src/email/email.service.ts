import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private sgMail: MailService;
  constructor(private config: ConfigService) {
    this.sgMail = new MailService();
    this.sgMail.setApiKey(this.config.get<string>('SGMAIL_AUTH')!);
  }
  async sendEmail(to: string, subject: string, html: string) {
    const msg = {
      to,
      from: this.config.get('SENDER_EMAIL'),
      subject,
      html,
    };

    try {
      await this.sgMail.send(msg);
      console.log(`Email sent to: ${to}`);
      return { success: true, message: `Email sent to ${to}` };
    } catch (error) {
      console.error('Error sending email:', error.message);
      throw error;
    }
  }
}
