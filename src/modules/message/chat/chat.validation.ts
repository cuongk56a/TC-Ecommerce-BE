import Joi from 'joi';
import {customValidations} from '../../../utils/validations/custom.validation';

const createOne = {
  body: Joi.object().keys({
    roomId: Joi.string().required(),
    senderId: Joi.string().custom(customValidations.objectId).required(),
    content: Joi.string().required(),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    chatId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    roomId: Joi.string(),
    senderId: Joi.string().custom(customValidations.objectId),
    content: Joi.string(),
    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    chatId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};


const getOne = {
  params: Joi.object().keys({
    chatId: Joi.string().custom(customValidations.objectId).required(),
  }),
  query: Joi.object().keys({
    hasSender: Joi.boolean(),
  }),
};

const getList = {
  query: Joi.object().keys({
    roomId: Joi.string(),
    hasSender: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    roomId: Joi.string(),
    hasSender: Joi.boolean(),
  }),
};

export const chatValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
