import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { htmlEmailFormat } from './email.template';
import { User } from '@prisma/client';

interface EmailOptions {
  from?: string;
  to: string;
  user?: User;
  frontendUrl?: string;
  baseTitle?: string;
  title: string;
  actionLink?: string;
  actionText?: string;
  logoUrl?: string;
  description?: string;
  highlightedText?: string;
}

@Injectable()
export class EmailService {
  public constructor(private configService: ConfigService) {}
  private getEmailTransporter() {
    const transporter = createTransport(
      {
        host: this.configService.get('MAIL_HOST'),
        port: this.configService.get('MAIL_PORT'),

        auth: {
          user: this.configService.get('MAIL_USERNAME'),
          pass: this.configService.get('MAIL_PASSWORD'),
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      { debug: true },
    );
    return transporter;
  }

  async sendEmail(options: EmailOptions) {
    if (!options.baseTitle) {
      options.baseTitle = 'Gahigi AI';
    }
    if (!options.logoUrl) {
      options.logoUrl =
        this.configService.get('FRONTEND_URL') +
        '/assets/lib/assets/images/logo.png';
    }
    if (!options.frontendUrl) {
      options.frontendUrl = this.configService.get('FRONTEND_URL');
    }
    let transporter = this.getEmailTransporter();
    console.log(transporter.options);
    let html = htmlEmailFormat(options);
    let result = await transporter.sendMail({
      subject: options.title,
      html,
      to: options.to,
      sender: this.configService.get('MAIL_FROM'),
    });
    return result;
  }
}
