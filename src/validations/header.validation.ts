import Joi from 'joi';

const JSON = [ 'application/json', 'application/json; charset=utf-8' ];

const SCHEMA = {
  AUTHORIZATION: Joi.string().regex( /^Bearer.*/ ).required(),
  CONTENT_TYPE: Joi.string().valid( ...JSON ).required(),
};

export const clientHeaders = Joi.object({
  'authorization': SCHEMA.AUTHORIZATION,
  'content-type': SCHEMA.CONTENT_TYPE,
}).required();
