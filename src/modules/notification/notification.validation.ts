import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';
import { NOTIFICATION_FOR, NOTIFICATION_TYPE } from './notification.type';

const createOne = {
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId).required(),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION).default(TABLE_ORGANIZATION),
    notiType: Joi.string().valid(...Object.values(NOTIFICATION_TYPE)),
    title: Joi.string(),
    content: Joi.string().empty(''),
    entityId: Joi.string().custom(customValidations.objectId),
    notiFor: Joi.string().valid(...Object.values(NOTIFICATION_FOR)),
    users: Joi.array().items(Joi.string().custom(customValidations.objectId)),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    notiType: Joi.string().valid(...Object.values(NOTIFICATION_TYPE)),
    title: Joi.string(),
    content: Joi.string().empty(''),
    entityId: Joi.string().custom(customValidations.objectId),
    notiFor: Joi.string().valid(...Object.values(NOTIFICATION_FOR)),
    users: Joi.array().items(Joi.string().custom(customValidations.objectId)),
    userId: Joi.string().custom(customValidations.objectId),
    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};


const getOne = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const getList = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    notiType: Joi.string().valid(...Object.values(NOTIFICATION_TYPE)),
    entityId: Joi.string().custom(customValidations.objectId),
    notiFor: Joi.string().valid(...Object.values(NOTIFICATION_FOR)),
    users: Joi.array().items(Joi.string().custom(customValidations.objectId)),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    notiType: Joi.string().valid(...Object.values(NOTIFICATION_TYPE)),
    entityId: Joi.string().custom(customValidations.objectId),
    notiFor: Joi.string().valid(...Object.values(NOTIFICATION_FOR)),
    users: Joi.array().items(Joi.string().custom(customValidations.objectId)),
  }),
};

export const notificationValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
