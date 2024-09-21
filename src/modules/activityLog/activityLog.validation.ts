import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';
import { METHOD_TYPE, MODEL_TYPE } from './activityLog.type';

const getOne = {
  params: Joi.object().keys({
    activityLogId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const getList = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    methodType: Joi.string().valid(...Object.values(METHOD_TYPE)).empty(''),
    modelType: Joi.string().valid(...Object.values(MODEL_TYPE)).empty(''),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    methodType: Joi.string().valid(...Object.values(METHOD_TYPE)).empty(''),
    modelType: Joi.string().valid(...Object.values(MODEL_TYPE)).empty(''),
  }),
};

export const activityLogValidation = {
  getOne,
  getAll,
  getList,
};
