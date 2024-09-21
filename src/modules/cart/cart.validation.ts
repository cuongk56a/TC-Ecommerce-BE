import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';
import {TABLE_ORGANIZATION} from '../organization/organization.configs';

const createOne = {
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId).required(),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION).default(TABLE_ORGANIZATION),
    items: Joi.array().items(
      Joi.object().keys({
        productId: Joi.string().custom(customValidations.objectId).required(),
        qty: Joi.number().required(),
      }),
    ),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    items: Joi.array().items(
      Joi.object().keys({
        productId: Joi.string().custom(customValidations.objectId).required(),
        qty: Joi.number().required(),
      }),
    ),
    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};

const getOne = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const getList = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    createdById: Joi.string().custom(customValidations.objectId),
    hasTarget: Joi.boolean(),
    hasProduct: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};

const getAll = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    createdById: Joi.string().custom(customValidations.objectId),
    hasTarget: Joi.boolean(),
    hasProduct: Joi.boolean(),
  }),
};

const createOrUpdate= {
  body: Joi.object().keys({
    productId: Joi.string().custom(customValidations.objectId).required(),
    qty: Joi.number().required(),
  })
}

export const cartValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
  createOrUpdate,
};
