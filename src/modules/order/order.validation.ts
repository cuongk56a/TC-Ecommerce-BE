import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';
import { TABLE_ORGANIZATION } from '../organization/organization.configs';
import { PAYMENT_METHOD_TYPE, STATUS_ORDER_TYPE } from './order.type';

const createOne = {
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId).required(),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION).default(TABLE_ORGANIZATION),
    cart: Joi.array().items(
      Joi.object().keys({
        productId: Joi.string().custom(customValidations.objectId).required(),
        name: Joi.string().required(),
        qty: Joi.number().required(),
        unitPrice: Joi.number().required(),
        amount: Joi.number().required(),
      })
    ),
    shippingAddressId: Joi.string().custom(customValidations.objectId).required(),
    shippingCode: Joi.string().empty(''),
    shippingService: Joi.string().empty(''),
    shippingFee: Joi.number(),
    total: Joi.number().required(),
    voucherIds: Joi.array().items(
      Joi.string().custom(customValidations.objectId),
    ),
    paymentMethod: Joi.string().valid(...Object.values(PAYMENT_METHOD_TYPE)),
    totalDiscount: Joi.number().required(),
    totalPayment: Joi.number().required(),
    note: Joi.string().empty(''),
    status: Joi.string().valid(...Object.values(STATUS_ORDER_TYPE)).default(STATUS_ORDER_TYPE.PENDING),
    createdById: Joi.string().custom(customValidations.objectId),
  }),
};

const updateOne = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    cart: Joi.array().items(
      Joi.object().keys({
        productId: Joi.string().custom(customValidations.objectId),
        name: Joi.string(),
        qty: Joi.number(),
        unitPrice: Joi.number(),
        amount: Joi.number(),
      })
    ),
    shippingAddressId: Joi.string().custom(customValidations.objectId),
    shippingCode: Joi.string().empty(''),
    shippingService: Joi.string().empty(''),
    shippingFee: Joi.number(),
    total: Joi.number(),
    voucherIds: Joi.array().items(
      Joi.string().custom(customValidations.objectId),
    ),
    paymentMethod: Joi.string().valid(...Object.values(PAYMENT_METHOD_TYPE)),
    totalDiscount: Joi.number(),
    totalPayment: Joi.number(),
    note: Joi.string().empty(''),
    status: Joi.string().valid(...Object.values(STATUS_ORDER_TYPE)),
    updatedById: Joi.string().custom(customValidations.objectId),
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    deletedById: Joi.string().custom(customValidations.objectId),
    deletedAt: Joi.date().required(),
  }),
};


const getOne = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const getList = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    CODE: Joi.string().empty(''),
    status: Joi.string().valid(...Object.values(STATUS_ORDER_TYPE)),
    hasCreated: Joi.boolean(),
    hasShippingAddress: Joi.boolean(),
    hasVouchers: Joi.boolean(),
    hasItems: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION),
    CODE: Joi.string().empty(''),
    status: Joi.string().valid(...Object.values(STATUS_ORDER_TYPE)),
    hasCreated: Joi.boolean(),
    hasShippingAddress: Joi.boolean(),
    hasVouchers: Joi.boolean(),
    hasItems: Joi.boolean(),
  }),
};

export const orderValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
