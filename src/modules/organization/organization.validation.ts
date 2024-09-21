import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';

const createOne = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    hotline: Joi.string().required(),
    email: Joi.string().email().required(),
    webUrl: Joi.string().empty(''),
    thumbnail: Joi.string().required(),
    slogan: Joi.string(),
    addressId: Joi.string().custom(customValidations.objectId),
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
    thumbnail: Joi.string().required(),
    slogan: Joi.string(),
    addressId: Joi.string().custom(customValidations.objectId),
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
    name: Joi.string(),
    hotline: Joi.string(),
    search: Joi.string().empty(''),
    hasAddress: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    name: Joi.string(),
    hotline: Joi.string(),
    search: Joi.string().empty(''),
    hasAddress: Joi.boolean(),
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
