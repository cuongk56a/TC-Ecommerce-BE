import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';

const updateOne = {
  params: Joi.object().keys({
    locationId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    latitude: Joi.number().empty(''),
    longitude: Joi.number().empty(''),
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
    locationId: Joi.string().custom(customValidations.objectId),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    locationId: Joi.string().custom(customValidations.objectId),
  }),
};

export const locationValidation = {
  updateOne,
  getOne,
  getAll,
  getList,
};
