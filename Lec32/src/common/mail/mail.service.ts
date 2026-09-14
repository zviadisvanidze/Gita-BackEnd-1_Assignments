import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly fromAddress: string;

  constructor(private readonly configService: ConfigService) {
    this.fromAddress = this.configService.get<string>(
      'MAIL_FROM',
      'Movies App <no-reply@movies-app.com>',
    );

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('MAIL_PORT', 587),
      secure: this.configService.get<string>('MAIL_SECURE', 'false') === 'true',
      auth: {
        user: this.configService.get<string>('MAIL_USER', ''),
        pass: this.configService.get<string>('MAIL_PASSWORD', ''),
      },
    });
  }

  private async sendMail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject,
        html,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}: ${(error as Error).message}`,
      );
    }
  }

  async sendOtpEmail(
    to: string,
    name: string,
    code: string,
    expiresInMinutes: number,
  ): Promise<void> {
    const subject = 'თქვენი ვერიფიკაციის კოდი';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>გამარჯობა, ${name}!</h2>
        <p>რეგისტრაციის დასასრულებლად შეიყვანეთ ქვემოთ მოცემული ვერიფიკაციის კოდი:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">${code}</p>
        <p>კოდი მოქმედია <b>${expiresInMinutes}</b> წუთის განმავლობაში.</p>
        <p>თუ თქვენ არ დაარეგისტრირდით ჩვენს პლატფორმაზე, უბრალოდ იგნორირება გაუკეთეთ ამ წერილს.</p>
      </div>
    `;
    await this.sendMail(to, subject, html);
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const subject = 'კეთილი იყოს თქვენი მობრძანება!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>გამარჯობა, ${name}!</h2>
        <p>თქვენი ანგარიში წარმატებით დადასტურდა. მადლობა, რომ შემოუერთდით ჩვენს პლატფორმას!</p>
      </div>
    `;
    await this.sendMail(to, subject, html);
  }

  async sendAccountDeactivatedEmail(to: string, name: string): Promise<void> {
    const subject = 'თქვენი ანგარიში დეაქტივირებულია';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>გამარჯობა, ${name}!</h2>
        <p>თქვენი ანგარიში წარმატებით დეაქტივირდა და მასზე შესვლა შეუძლებელი გახდება.</p>
        <p>თუ ეს მოქმედება თქვენ არ განგიხორციელებიათ, დაუყოვნებლივ დაგვიკავშირდით.</p>
      </div>
    `;
    await this.sendMail(to, subject, html);
  }
}
