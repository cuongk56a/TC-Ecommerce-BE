import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';

const createOne = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    hotline: Joi.string().required(),
    email: Joi.string().email().required(),
    webUrl: Joi.string(),
    thumbnail: Joi.string().required(),
    banner: Joi.string(),
    address: Joi.string(),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    organizationId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    hotline: Joi.string(),
    email: Joi.string().email(),
    webUrl: Joi.string().empty(''),
    thumbnail: Joi.string(),
    banner: Joi.string().empty(''),
    address: Joi.string().empty(''),
    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    organizationId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};


const getOne = {
  params: Joi.object().keys({
    organizationId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const getList = {
  query: Joi.object().keys({
    organizationId: Joi.string().custom(customValidations.objectId),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    organizationId: Joi.string().custom(customValidations.objectId),
  }),
};

export const organizationValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
