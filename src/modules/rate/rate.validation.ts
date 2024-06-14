import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';

const createOne = {
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId).required(),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION).default(TABLE_ORGANIZATION),
    productId: Joi.string().custom(customValidations.objectId).required(),
    star: Joi.number(),
    comment: Joi.string().empty(''),
    attachments: Joi.array().items(
      Joi.string().required()
    ),
    createdById: Joi.string().custom(customValidations.objectId).empty(''),
  }),
};

const updateOne = {
  params: Joi.object().keys({
    rateId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    productId: Joi.string().custom(customValidations.objectId),
    star: Joi.number(),
    comment: Joi.string().empty(''),
    attachments: Joi.array().items(
      Joi.string().required()
    ),
    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    rateId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};


const getOne = {
  params: Joi.object().keys({
    rateId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const getList = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    productId: Joi.string().custom(customValidations.objectId),
    createdById: Joi.string().custom(customValidations.objectId),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    productId: Joi.string().custom(customValidations.objectId),
    createdById: Joi.string().custom(customValidations.objectId),
  }),
};

export const rateValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
