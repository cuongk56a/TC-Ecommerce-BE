import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';
import { LOCATION_TYPE } from './location.type';

const updateOne = {
  params: Joi.object().keys({
    locationId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    latitude: Joi.number().empty(''),
    longitude: Joi.number().empty(''),
    parentId: Joi.string().custom(customValidations.objectId).empty(''),
    vtpId: Joi.number().empty(''),
    ...customValidations.updateEntityValidation,
  }),
};

const getOne = {
  params: Joi.object().keys({
    locationId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const getList = {
  query: Joi.object().keys({
    parentId: Joi.string().custom(customValidations.objectId),
    locationType: Joi.string().valid(...Object.values(LOCATION_TYPE)),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    parentId: Joi.string().custom(customValidations.objectId),
    locationType: Joi.string().valid(...Object.values(LOCATION_TYPE)),
  }),
};

export const locationValidation = {
  updateOne,
  getOne,
  getAll,
  getList,
};
