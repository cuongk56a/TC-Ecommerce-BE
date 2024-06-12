import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';
import { PERMISSION_TYPE } from './role.type';

const createOne = {
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId).required(),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION).default(TABLE_ORGANIZATION),
    name: Joi.string().required(),
    permissions: Joi.array().items(
      Joi.string().valid(...Object.values(PERMISSION_TYPE))
    ),
    isActive: Joi.boolean().default(true),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    roleId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    name: Joi.string(),
    permissions: Joi.array().items(
      Joi.string().valid(...Object.values(PERMISSION_TYPE))
    ),
    isActive: Joi.boolean(),
    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    roleId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};


const getOne = {
  params: Joi.object().keys({
    roleId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const getList = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId).required(),
    isActive: Joi.boolean(),
    search: Joi.string().empty(''),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId).required(),
    isActive: Joi.boolean(),
    search: Joi.string().empty(''),
  }),
};

const addUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId).required(),
    targetId: Joi.string().custom(customValidations.objectId).required(),
  }),
}

const removeUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId).required(),
  }),
}

export const roleValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
  addUser,
  removeUser,
};
