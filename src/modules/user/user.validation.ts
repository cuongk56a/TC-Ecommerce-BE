import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';
import { UserGender } from './user.type';

const createOne = {
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    avatar: Joi.string(),
    hashedPassword: Joi.string(),
    phone: Joi.string(),
    email: Joi.string(),
    birthday: Joi.string(),
    gender: Joi.string().valid(...Object.values(UserGender)),
    address: Joi.string(),
    isTeacher: Joi.boolean(),
    importCode: Joi.string(),
    organizationId: Joi.string().custom(customValidations.objectId),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    fullName: Joi.string(),
    avatar: Joi.string(),
    hashedPassword: Joi.string(),
    phone: Joi.string(),
    email: Joi.string(),
    birthday: Joi.string(),
    gender: Joi.string().valid(...Object.values(UserGender)),
    country: Joi.string(),
    address: Joi.string(),
    organizationId: Joi.string().custom(customValidations.objectId),
    isAdmin: Joi.boolean(),
    isTeacher: Joi.boolean(),
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
    hasStudent: Joi.boolean(),
  }),
};

const getList = {
  query: Joi.object().keys({
    organizationId: Joi.string().custom(customValidations.objectId),
    search: Joi.string(),
    isAdmin: Joi.boolean(),
    isTeacher: Joi.boolean(),
    hasSubject: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    organizationId: Joi.string().custom(customValidations.objectId),
    isAdmin: Joi.boolean(),
    isTeacher: Joi.boolean(),
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
