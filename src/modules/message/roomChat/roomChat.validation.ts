import Joi from 'joi';
import {customValidations} from '../../../utils/validations/custom.validation';
import { TABLE_ORGANIZATION } from '../../organization/organization.configs';

const createOne = {
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId).required(),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION).default(TABLE_ORGANIZATION),
    // roomId: Joi.string().custom(customValidations.objectId).required(),
    userId: Joi.string().custom(customValidations.objectId).required(),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    roomChatId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    userId: Joi.string().custom(customValidations.objectId),
    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    roomChatId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};


const getOne = {
  params: Joi.object().keys({
    roomChatId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const getList = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    userId: Joi.string().custom(customValidations.objectId),
    roomId: Joi.string(),
    hasUser: Joi.boolean(),
    hasTarget: Joi.boolean(),
    hasMessage: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    userId: Joi.string().custom(customValidations.objectId),
    roomId: Joi.string(),
    hasUser: Joi.boolean(),
    hasTarget: Joi.boolean(),
    hasMessage: Joi.boolean(),
  }),
};

const createOrUpdate = {
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    userId: Joi.string().custom(customValidations.objectId),
    ...customValidations.createEntityValidation,
  }),
}

export const roomChatValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
  createOrUpdate,
};
