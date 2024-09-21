import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';
import { BANNER_ACTION_TYPE } from './banner.type';

const createOne = {
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId).required(),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION).default(TABLE_ORGANIZATION),
    name: Joi.string().required(),
    thumbnail: Joi.string().required(),
    entityType: Joi.string().valid(...Object.values(BANNER_ACTION_TYPE)),
    entityId: Joi.string().custom(customValidations.objectId).empty(''),
    isActive: Joi.boolean(),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    bannerId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    name: Joi.string().required(),
    thumbnail: Joi.string().required(),
    entityType: Joi.string().valid(...Object.values(BANNER_ACTION_TYPE)),
    entityId: Joi.string().custom(customValidations.objectId).allow(null,''),
    isActive: Joi.boolean(),
    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    bannerId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};


const getOne = {
  params: Joi.object().keys({
    bannerId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const getList = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    isActive: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    sort: Joi.string().empty(''),
    isActive: Joi.boolean(),
  }),
};

export const bannerValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
