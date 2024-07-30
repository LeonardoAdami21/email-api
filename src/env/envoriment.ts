import * as dotenv from 'dotenv';

dotenv.config();

export const environment = {
  DATABASE_URL: process.env.DATABASE_URL,
  APP_PORT: process.env.APP_PORT,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_PORT: process.env.POSTGRES_PORT,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET,
  NODEMAILER_HOST: process.env.NODEMAILER_HOST,
  NODEMAILER_USER: process.env.NODEMAILER_USER,
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,
  NODEMAILER_PORT: process.env.NODEMAILER_PORT,
};
