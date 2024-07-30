import { environment } from '../env/envoriment';
import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

export const mailerConfig: MailerOptions = {
  template: {
    dir: path.resolve(__dirname, '..', '..', 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      extName: '.hbs',
      layoutsDir: path.resolve(__dirname, '..', '..', 'templates'),
    },
  },
  options: {
    html: true,
  },
  transport: {
    host: environment.NODEMAILER_HOST,
    port: Number(environment.NODEMAILER_PORT),
    secure: false,
    auth: {
      user: environment.NODEMAILER_USER,
      pass: environment.NODEMAILER_PASS,
    },
  },
};
