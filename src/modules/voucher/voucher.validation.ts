import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';
import { APPLY_FOR_TYPE, APPLY_FOR_USER_TYPE, DISCOUNT_TYPE, VOUCHER_TYPE } from './voucher.type';

const createOne = {
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId).required(),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION).default(TABLE_ORGANIZATION),
    title: Joi.string().required(),
    thumbnail: Joi.string().required(),
    description:  Joi.string().allow(''),
    voucherType: Joi.string().valid(...Object.values(VOUCHER_TYPE)),
    discountType: Joi.string().valid(...Object.values(DISCOUNT_TYPE)),
    minDiscountValue: Joi.number().empty(''),
    maxDiscountValue: Joi.number().empty(''),
    totalTurn: Joi.number().empty(''),
    userMaxTurn: Joi.number().empty(''),
    applyForUser: Joi.string().valid(...Object.values(APPLY_FOR_USER_TYPE)),
    applyFor: Joi.string().valid(...Object.values(APPLY_FOR_TYPE)),
    applyUser: Joi.array().items(
      Joi.string().custom(customValidations.objectId).required(),
    ),
    applyProduct: Joi.array().items(
      Joi.string().custom(customValidations.objectId).required(),
    ),
    applyCategory: Joi.array().items(
      Joi.string().custom(customValidations.objectId).required(),
    ),
    usage: Joi.array().items(
      Joi.object().keys({
        orderId: Joi.string().custom(customValidations.objectId).required(),
        userId: Joi.string().custom(customValidations.objectId).required(),
      })
    ),
    startAt: Joi.string().required(),
    endAt: Joi.string().empty(''),
    isActive: Joi.boolean(),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    voucherId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    title: Joi.string(),
    thumbnail: Joi.string(),
    description:  Joi.string().allow(''),
    voucherType: Joi.string().valid(...Object.values(VOUCHER_TYPE)),
    discountType: Joi.string().valid(...Object.values(DISCOUNT_TYPE)),
    minDiscountValue: Joi.number(),
    maxDiscountValue: Joi.number(),
    totalTurn: Joi.number(),
    userMaxTurn: Joi.number(),
    applyForUser: Joi.string().valid(...Object.values(APPLY_FOR_USER_TYPE)),
    applyFor: Joi.string().valid(...Object.values(APPLY_FOR_TYPE)),
    applyUser: Joi.array().items(
      Joi.string().custom(customValidations.objectId).required(),
    ),
    applyProduct: Joi.array().items(
      Joi.string().custom(customValidations.objectId).required(),
    ),
    applyCategory: Joi.array().items(
      Joi.string().custom(customValidations.objectId).required(),
    ),
    usage: Joi.array().items(
      Joi.object().keys({
        orderId: Joi.string().custom(customValidations.objectId).required(),
        userId: Joi.string().custom(customValidations.objectId).required(),
      })
    ),
    startAt: Joi.string(),
    endAt: Joi.string().allow(''),
    isActive: Joi.boolean(),
    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    voucherId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};


const getOne = {
  params: Joi.object().keys({
    voucherId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const getList = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    userId: Joi.string().custom(customValidations.objectId),
    voucherType: Joi.string().valid(...Object.values(VOUCHER_TYPE)),
    search: Joi.string().empty(''),
    check: Joi.boolean(),
    hasTarget: Joi.boolean(),
    hasProducts: Joi.boolean(),
    hasCategories: Joi.boolean(),
    isActive: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    userId: Joi.string().custom(customValidations.objectId),
    voucherType: Joi.string().valid(...Object.values(VOUCHER_TYPE)),
    search: Joi.string().empty(''),
    check: Joi.boolean(),
    hasTarget: Joi.boolean(),
    hasProducts: Joi.boolean(),
    hasCategories: Joi.boolean(),
    isActive: Joi.boolean(),
  }),
};

const canUse = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    userId: Joi.string().custom(customValidations.objectId),
    voucherType: Joi.string().valid(...Object.values(VOUCHER_TYPE)),
    productIds: Joi.string().empty(''),
    categoryIds: Joi.string().empty(''),
  })

}

export const voucherValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
  canUse,
};
