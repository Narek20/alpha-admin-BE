import Joi from 'joi';
import { clientHeaders } from './header.validation';

/**
 * POST v1/calls
 */
export const createUser = {
  headers: clientHeaders,
  body: Joi.object({
    phone: Joi.string().required(),
  }).required(),
};