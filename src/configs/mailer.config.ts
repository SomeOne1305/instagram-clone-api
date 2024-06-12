import { MailerOptions } from '@nestjs-modules/mailer';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'mailerConfig',
  (): MailerOptions => ({
    transport: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILER_MAIL,
        pass: process.env.MAILER_PASS,
      },
    },
  }),
);
