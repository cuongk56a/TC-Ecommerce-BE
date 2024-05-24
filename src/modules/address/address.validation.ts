import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';

const createOne = {
  body: Joi.object().keys({
    name: Joi.string(),
    phone: Joi.string(),
    email: Joi.string(),
    isDefault: Joi.boolean().default(false),
    note: Joi.string().required(),
    provinceId: Joi.string().custom(customValidations.objectId).required(),
    districtId: Joi.string().custom(customValidations.objectId).required(),
    wardId: Joi.string().custom(customValidations.objectId).required(),
    createdById: Joi.string().custom(customValidations.objectId),
  }),
};

const updateOne = {
  params: Joi.object().keys({
    addressId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    phone: Joi.string(),
    email: Joi.string(),
    isDefault: Joi.boolean(),
    note: Joi.string().required(),
    provinceId: Joi.string().custom(customValidations.objectId).required(),
    districtId: Joi.string().custom(customValidations.objectId).required(),
    wardId: Joi.string().custom(customValidations.objectId).required(),
    updatedById: Joi.string().custom(customValidations.objectId),
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    addressId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};


const getOne = {
  params: Joi.object().keys({
    addressId: Joi.string().custom(customValidations.objectId).required(),
  }),
  query: Joi.object().keys({
    hasLocation: Joi.boolean(),
  }),
};

const getList = {
  query: Joi.object().keys({
    createdById: Joi.string().custom(customValidations.objectId),
    hasLocation: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    createdById: Joi.string().custom(customValidations.objectId),
    hasLocation: Joi.boolean(),
    sort: Joi.string().empty('')
  }),
};

export const addressValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
