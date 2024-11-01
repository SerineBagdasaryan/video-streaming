import * as Joi from 'joi';
import { AppEnvironment } from '../common/constants';

export const getEnvValidation = () => {
  return Joi.object({
    // API_PARAMETERS
    NODE_ENV: Joi.string()
      .valid(...Object.values(AppEnvironment))
      .default(AppEnvironment.LOCAL),
    PORT: Joi.number().default(3333),
    // DB_PARAMETERS
    DB_DATABASE: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.string().required(),
    //JWT_PARAMETERS
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES: Joi.string().required(),
    //REDIS_PARAMETERS
    REDIS_PORT: Joi.number().required(),
    REDIS_HOST: Joi.string().required(),
  });
};
