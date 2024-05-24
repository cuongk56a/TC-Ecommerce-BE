import Joi from 'joi';
import {customValidations} from '../../../utils/validations/custom.validation';
import { TABLE_ORGANIZATION } from '../../organization/organization.configs';

const createOne = {
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId).required(),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION).default(TABLE_ORGANIZATION),
    barcode: Joi.string().empty(''),
    name: Joi.string().required(),
    thumbnail: Joi.string().empty(''),
    attachments: Joi.array().items(
      Joi.string().required()
    ),
    categoryId: Joi.string().custom(customValidations.objectId).empty(''),
    capitalPrice: Joi.number().empty(''),
    salePrice: Joi.number().empty(''),
    price: Joi.number(),
    quantity: Joi.number().default(0),
    weight: Joi.number().default(0),
    unitId: Joi.string().custom(customValidations.objectId),
    isActive: Joi.boolean().default(true),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    productId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    barcode: Joi.string().empty(''),
    name: Joi.string(),
    thumbnail: Joi.string().empty(''),
    attachments: Joi.array().items(
      Joi.string().required()
    ),
    categoryId: Joi.string().custom(customValidations.objectId).empty(''),
    capitalPrice: Joi.number().empty(''),
    salePrice: Joi.number().empty(''),
    price: Joi.number(),
    quantity: Joi.number(),
    weight: Joi.number(),
    unitId: Joi.string().custom(customValidations.objectId),
    isActive: Joi.boolean(),
    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    productId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};


const getOne = {
  params: Joi.object().keys({
    productId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const getList = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    priceByWeight: Joi.boolean(),
    isActive: Joi.boolean(),
    search: Joi.string().empty(''),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    search: Joi.string(),
    sort: Joi.string(),
    priceByWeight: Joi.boolean(),
    isActive: Joi.boolean(),
  }),
};

export const productValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
