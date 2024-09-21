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
    brandId: Joi.string().custom(customValidations.objectId).empty(''),
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
    brandId: Joi.string().custom(customValidations.objectId).empty(''),
    capitalPrice: Joi.number().empty(''),
    salePrice: Joi.number().empty(''),
    price: Joi.number(),
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
  query: Joi.object().keys({
    hasUnit: Joi.boolean(),
    hasCategory: Joi.boolean(),
    hasBrand: Joi.boolean(),
  }),
};

const getList = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    categoryId: Joi.string().custom(customValidations.objectId).empty(''),
    brandId: Joi.string().custom(customValidations.objectId).empty(''),
    isActive: Joi.boolean(),
    search: Joi.string().empty(''),
    hasUnit: Joi.boolean(),
    hasCategory: Joi.boolean(),
    hasBrand: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    search: Joi.string().empty(''),
    categoryId: Joi.string().custom(customValidations.objectId).empty(''),
    brandId: Joi.string().custom(customValidations.objectId).empty(''),
    sort: Joi.string().empty(''),
    isActive: Joi.boolean(),
    hasUnit: Joi.boolean(),
    hasCategory: Joi.boolean(),
    hasBrand: Joi.boolean(),
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
