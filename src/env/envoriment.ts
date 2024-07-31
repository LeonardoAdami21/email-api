import * as dotenv from 'dotenv';

dotenv.config();

export const environment = {
  databaseUrl: process.env.DATABASE_URL,
  appPort: process.env.APP_PORT,
  jwtSecret: process.env.JWT_SECRET,
  nodeMailerHost: process.env.NODEMAILER_HOST,
  nodeMailerUser: process.env.NODEMAILER_USER,
  nodeMailerPass: process.env.NODEMAILER_PASS,
  nodeMailerPort: process.env.NODEMAILER_PORT,
};
