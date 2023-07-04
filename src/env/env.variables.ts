import dotenv from 'dotenv';

dotenv.config({});

export interface EnvVariables {
  mongoUrl?: string;
  tokenKey?: string;
  sendGridSecret?: string
  port?: string;
}

const env: EnvVariables = {
  mongoUrl: process.env.DATABASE_CONNECTION_URL,
  tokenKey: process.env.TOKEN_KEY,
  sendGridSecret: process.env.SENDGRID_SECRET,
  port: process.env.PORT,
};

export default env;
