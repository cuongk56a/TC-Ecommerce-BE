import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';

export enum VOUCHER_TYPE {
  ORDER = 'ORDER',
  SHIP = 'SHIP',
}

export enum DISCOUNT_TYPE {
  PERCENT = 'PERCENT',
  DIRECT = 'DIRECT',
}

export enum APPLY_FOR_USER_TYPE {
  NEW = 'NEW',
  ALL = 'ALL',
  SOME = 'SOME',
}

export enum APPLY_FOR_TYPE {
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  ALL = 'ALL',
}

export interface IVoucherDoc extends IDoc {
  targetId: mongoose.Schema.Types.ObjectId;
  targetOnModel: string;
  title: string;
  thumbnail: string;
  description: string;
  voucherType: VOUCHER_TYPE;
  discountType: DISCOUNT_TYPE;
  minDiscountValue?: number;
  maxDiscountValue?: number;
  totalTurn?: number;
  userMaxTurn?: number;
  applyForUser: APPLY_FOR_USER_TYPE;
  applyFor: APPLY_FOR_TYPE;
  applyUser: mongoose.Schema.Types.ObjectId[];
  applyProduct: mongoose.Schema.Types.ObjectId[];
  applyCategory: mongoose.Schema.Types.ObjectId[];
  usage: {
    orderId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId
  }[];
  usageCount: number;
  startAt: string;
  endAt: string;
  startTime: number;
  endTime: number;
  isActive: boolean;
}
