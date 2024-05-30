import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';

const createOrUpdateOne = {
  body: Joi.object().keys({
    fileName: Joi.string().required(),
    ...customValidations.createEntityValidation,
  }),
};

const getList = {
  query: Joi.object().keys({
    fileName: Joi.string().empty(''),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
  }),
};

export const imageValidation = {
  createOrUpdateOne,
  getAll,
  getList,
};
