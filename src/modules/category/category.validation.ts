import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';

const createOne = {
  body: Joi.object().keys({
    parentId: Joi.string().custom(customValidations.objectId).empty(''),

    name: Joi.string().required(),
    description: Joi.string().required(),
    thumbnail: Joi.string().required(),

    isActive: Joi.boolean().default(true),
    inHome: Joi.boolean().default(false),

    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    parentId: Joi.string().custom(customValidations.objectId).empty(''),
    name: Joi.string(),
    description: Joi.string(),
    thumbnail: Joi.string(),
    isActive: Joi.boolean(),
    inHome: Joi.boolean(),

    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};

const getOne = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(customValidations.objectId).required(),
  }),
  query: Joi.object().keys({
    hasChild: Joi.boolean(),
  }),
};

const getList = {
  query: Joi.object().keys({
    parentId: Joi.string().custom(customValidations.objectId),
    isActive: Joi.boolean(),
    inHome: Joi.boolean(),

    search: Joi.string().empty(''),
    hasChild: Joi.boolean(),

    ...customValidations.paginateValidation,
  }),
};

const getAll = {
  query: Joi.object().keys({
    ids: Joi.string(),
    parentId: Joi.string().custom(customValidations.objectId),
    isActive: Joi.boolean(),
    inHome: Joi.boolean(),
    search: Joi.string().empty(''),
    sort: Joi.string().empty(''),

    hasChild: Joi.boolean(),
  }),
};

export const categoryValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getList,
  getAll,
};
