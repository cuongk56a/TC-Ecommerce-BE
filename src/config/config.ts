import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({path: path.join(__dirname, '../../.env')});

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),

    REDIS_HOST: Joi.string().default('127.0.0.1'),
    REDIS_PORT: Joi.string().default(6379),
    REDIS_PASSWORD: Joi.string().allow('', null),

    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    TABLE_PREFIX: Joi.string().required(),

    VALIDATION_FORMAT_DATE: Joi.string().required(),
    VALIDATION_FORMAT_DATETIME: Joi.string().required(),

    APP_QUEUENAME_PREFIX: Joi.string().required(),

    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),

    SERVICE_FILE_URI: Joi.string().required(),
  })
  .unknown();

const {value: envVars, error} = envVarsSchema.prefs({errors: {label: 'key'}}).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const appConfigs = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  redis: `redis://:${!!envVars.REDIS_PASSWORD ? envVars.REDIS_PASSWORD + '@' : ''}@${envVars.REDIS_HOST}:${
    envVars.REDIS_PORT
  }`,
  token_secret: envVars.JWT_TOKEN_SECRET,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  database: {
    tablePrefix: envVars.TABLE_PREFIX,
  },
  queueNamePrefix: envVars.APP_QUEUENAME_PREFIX,
  validation: {
    formatDate: envVars.VALIDATION_FORMAT_DATE,
    formatDateTime: envVars.VALIDATION_FORMAT_DATETIME,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    accessExpirationSeconds: envVars.JWT_ACCESS_EXPIRATION_MINUTES * 60,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  services: {
    svFile: envVars.SERVICE_FILE_URI,
  },
};
