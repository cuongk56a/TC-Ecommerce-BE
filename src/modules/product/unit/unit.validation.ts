import Joi from 'joi';
import {customValidations} from '../../../utils/validations/custom.validation';

const createOne = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().empty(''),
    isActive: Joi.boolean().default(true),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    unitId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string().empty(''),
    isActive: Joi.boolean(),
    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    unitId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};


const getOne = {
  params: Joi.object().keys({
    unitId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const getList = {
  query: Joi.object().keys({
    isActive: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    isActive: Joi.boolean(),
  }),
};

export const unitValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
