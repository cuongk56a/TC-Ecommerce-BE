import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';

const createOrUpdateMany = {
  body: Joi.object().keys({
    images: Joi.array().items(Joi.string())
  }),
};

const getOne = {
  params: Joi.object().keys({
    fileName: Joi.string().required(),
  }),
};


const getAll = {
  query: Joi.object().keys({
    fileName: Joi.string().empty(''),
  }),
};

export const imageValidation = {
  createOrUpdateMany,
  getOne,
  getAll,
};
