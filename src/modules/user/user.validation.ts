import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';
import { UserGender } from './user.type';

const createOne = {
  body: Joi.object().keys({
    phone: Joi.string().required(),
    hashedPassword: Joi.string().required(),
    fullName: Joi.string().required(),
    email: Joi.string().required(),
    avatar: Joi.string().empty(''),
    birthday: Joi.string().empty(''),
    gender: Joi.string().valid(...Object.values(UserGender)).default(UserGender.OTHER),
    addressId: Joi.string().custom(customValidations.objectId).empty(''),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    phone: Joi.string(),
    hashedPassword: Joi.string(),
    fullName: Joi.string(),
    email: Joi.string(),
    avatar: Joi.string().empty(''),
    birthday: Joi.string(),
    gender: Joi.string().valid(...Object.values(UserGender)),
    addressId: Joi.string().custom(customValidations.objectId),
    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};


const getOne = {
  params: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId).required(),
  }),
  query: Joi.object().keys({
    hasLocation: Joi.boolean(),
    hasRole: Joi.boolean(),
  }),
};

const getList = {
  query: Joi.object().keys({
    organizationId: Joi.string().custom(customValidations.objectId),
    phone: Joi.string().empty(''),
    email: Joi.string().empty(''),
    hasLocation: Joi.boolean(),
    hasOrganization: Joi.boolean(),
    search: Joi.string().empty(''),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    organizationId: Joi.string().custom(customValidations.objectId),
    phone: Joi.string().empty(''),
    email: Joi.string().empty(''),
    hasLocation: Joi.boolean(),
    hasOrganization: Joi.boolean(),
    search: Joi.string().empty(''),
  }),
};

export const userValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
